import "./formComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import obrazek from "../../images/obrazek.png";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../index";
import {
  Formik,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikErrors,
  Form,
} from "formik";
import * as Yup from "yup";

import React, { useEffect, useState } from "react";
import { writeBatch, doc, collection, getDocs } from "firebase/firestore";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { pl } from "date-fns/locale";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import type { RangeKeyDict } from "react-date-range";

import type { TimePickerProps } from "antd";
import { TimePicker, Input, Button, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertLegacyProps } from "antd/es/button";
import {
  postalCodeValidation,
  DisabledDays,
  OrderData,
  getBookedDays,
  getDisabledDays,
} from "./formHelpers";

const bubbleArr = [
  {
    top: "-5px",
    left: "-150px",
    height: "400px",
    width: "400px",
    borderRadius: "400px",
  },
  {
    top: "210px",
    left: "-270px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
];

interface OrderForm {
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  assType: string;
  deliveryType: string;
  timeFrames: {
    startDate?: Date | null;
    endDate?: Date | null;
    key?: string;
  }[];
  addressZipCode: string;
  addressCity: string;
  addressStreet: string;
  addressHouseNumber: string;
  paymentType: string;
  checked: boolean;
}

const FormikContactComponent: React.FC = () => {
  const handleFormSubmit: (
    values: OrderForm,
    formikHelpers: FormikHelpers<OrderForm>
  ) => void | Promise<void> = async (values, { setSubmitting, resetForm }) => {
    await writeToDatabase(values);
    setSubmitting(false);
    resetForm(); // Reset the form
  };
  const writeToDatabase = async (values: OrderForm) => {
    const orderId = uuidv4();
    const orderRef = doc(firestore, "orders", orderId);
    const personalDetailsRef = doc(firestore, "ordersPersonalDetails", orderId);

    const batch = writeBatch(firestore);

    batch.set(orderRef, {
      assType: values.assType,
      deliveryType: values.deliveryType,
      timeFrames: [
        values.timeFrames[0].startDate,
        values.timeFrames[0].endDate,
      ],
    });

    let addressZipCode = values.addressZipCode;
    let addressCity = values.addressCity;
    let addressStreet = values.addressStreet;
    let addressHouseNumber = values.addressHouseNumber;

    if (values.assType === "self-pickup") {
      addressZipCode = "";
      addressCity = "";
      addressStreet = "";
      addressHouseNumber = "";
    }

    batch.set(personalDetailsRef, {
      clientName: values.clientName,
      clientSurname: values.clientSurname,
      phoneNr: values.phoneNr,
      paymentType: values.paymentType,
      addressZipCode: addressZipCode,
      addressCity: addressCity,
      addressStreet: addressStreet,
      addressHouseNumber: addressHouseNumber,
    });

    await batch.commit();
  };

  // VALIDATION //
  const validationSchema = Yup.object().shape({
    clientName: Yup.string()
      .matches(/^[A-Za-z]+$/, {
        message: "Cyfry i znaki specjalne są zabronione",
      })
      .required("Proszę podać imię.")
      .max(20, "Proszę podać imię nie przekraczające 20 znaków."),
    clientSurname: Yup.string()
      .matches(/^[A-Za-z]+$/, {
        message: "Cyfry i znaki specjalne są zabronione",
      })
      .required("Proszę podać nazwisko.")
      .max(30, "Proszę podać nazwisko nie przekraczające 30 znaków."),
    phoneNr: Yup.string()
      .required("Proszę podać numer telefonu.")
      .matches(
        /^(?:(?:\+?48)?\s?)?(?:\d{3}\s?\d{3}\s?\d{3}|\d{2}-\d{3}-\d{2}-\d{2})$/,
        {
          message: "Proszę podać poprawny numer telefonu.",
        }
      )
      .trim("The contact name cannot include leading and trailing spaces"),
    paymentType: Yup.string().required("Proszę wybrać rodzaj płatności."),
    assType: Yup.string().required("Proszę wybrać rodzaj dmuchanej atrakcji."),
    deliveryType: Yup.string().required("Proszę wybrać rodzaj dostawy."),
    addressZipCode: Yup.string().when("deliveryType", {
      is: "delivery",
      then: () =>
        Yup.string()
          .required("Proszę podać kod pocztowy.")
          .matches(/^\d{2}-\d{3}$/, {
            message: "Kod pocztowy powinien być w formacie XX-XXX.",
          })
          .test(
            "correct pattern",
            "Podany kod pocztowy powinien należeć do puli polskich kodów pocztowych.",
            function (addressZipCode: string) {
              return postalCodeValidation(addressZipCode);
            }
          ),
    }),
    addressCity: Yup.string().when("deliveryType", {
      is: "delivery",
      then: () => Yup.string().required("Proszę podać miasto."),
    }),
    addressStreet: Yup.string().when("deliveryType", {
      is: "delivery",
      then: () => Yup.string().required("Proszę podać nazwę ulicy."),
    }),
    addressHouseNumber: Yup.string().when("deliveryType", {
      is: "delivery",
      then: () => Yup.string().required("Proszę podać numer budynku/lokalu."),
    }),
    checked: Yup.boolean().oneOf([true], "Proszę zaznaczyć zgodę."),
  });

  //ZipCode formatting
  const zipCodeFormatter = (prevZipCode: string, newZipCode: string) => {
    let inputValue = newZipCode;
    if (prevZipCode.length > newZipCode.length && newZipCode.length === 2) {
      inputValue = newZipCode.slice(0, 1);
    } else if (newZipCode.length >= 2) {
      inputValue = newZipCode.replace(/\D/g, ""); // Remove non-digit characters
      // Insert '-' after the second digit
      inputValue = inputValue.slice(0, 2) + "-" + inputValue.slice(2);
    }
    return inputValue.slice(0, 6);
  };

  //TrimmerFunc
  const trimAndSet = (
    fieldName: string,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<OrderForm>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = e.target.value.replace(/\s/g, "");
      setFieldValue(fieldName, trimmedValue);
    };
  };

  // timepicker
  // dayjs.extend(customParseFormat);
  // const onChange: TimePickerProps["onChange"] = (time, timeString) => {
  //   console.log(time, timeString);
  // };

  const [disabledDays, setDisabledDays] = useState<DisabledDays>();

  const assAmounts: { [key: string]: number } = {
    typeA: 2,
    typeB: 2,
  };

  useEffect(() => {
    const ordersCollection = collection(firestore, "orders");
    getDocs(ordersCollection).then((snapshot) => {
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          assType: data.assType,
          timeFrames: data.timeFrames,
        } as OrderData;
      });

      const reservationInfo = getBookedDays(ordersData);
      const disabledDaysResult = getDisabledDays(reservationInfo, assAmounts);
      setDisabledDays(disabledDaysResult);
    });
  }, []);

  return (
    <div>
      <NavigationComponent />
      <h1 className="main-content-heading">Rezerwacja</h1>
      <Formik
        initialValues={
          {
            clientName: "",
            clientSurname: "",
            phoneNr: "",
            assType: "",
            deliveryType: "",
            timeFrames: [
              {
                startDate: addDays(new Date(), 1),
                endDate: addDays(new Date(), 1),
                key: "selection",
              },
            ],
            addressCity: "",
            addressStreet: "",
            addressHouseNumber: "",
            addressZipCode: "",
            paymentType: "",
            checked: false,
          } as OrderForm
        }
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue, isValid, resetForm }) => (
          <Form className="main-form-content">
            <div className="img-container">
              {values.assType && <img
              className="img"
              src={obrazek}
              alt="dmuchanec1" />}
              {/* <BubblesComponent bubbles={upperBubbleArr} /> */}
            </div>
            <div>
              <label htmlFor="clientName"></label>
              <Field
                className="form-input-long"
                as={Input}
                type="text"
                placeholder="Imię (wymagane)"
                name="clientName"
                onChange={trimAndSet("clientName", setFieldValue)}
              />
              <ErrorMessage
                name="clientName"
                component="div"
                className="validationError"
              />
            </div>
            <div>
              <label htmlFor="clientSurname"></label>
              <Field
                className="form-input-long"
                as={Input}
                type="text"
                placeholder="Nazwisko (wymagane)"
                name="clientSurname"
                onChange={trimAndSet("clientSurname", setFieldValue)}
              />
              <ErrorMessage
                name="clientSurname"
                component="div"
                className="validationError"
              />
            </div>
            <div>
              <label htmlFor="phoneNr"></label>
              <Field
                className="form-input-long"
                as={Input}
                type="text"
                placeholder="Numer telefonu (wymagane)"
                name="phoneNr"
                onChange={trimAndSet("phoneNr", setFieldValue)}
              />
              <ErrorMessage
                name="phoneNr"
                component="div"
                className="validationError"
              />
            </div>
            <div>
              <Field
                className="form-input-long"
                name="assType"
                component={Select}
                placeholder="Wybierz rodzaj dmuchanej atrakcji"
                options={[
                  { value: "typeA", label: "Zamek A" },
                  { value: "typeB", label: "Zamek B" },
                ]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("assType", e);
                }}
              ></Field>

              <ErrorMessage
                name="assType"
                component="div"
                className="validationError"
              />
            </div>
            {values.assType && (
              <div>
                <label>Wybierz dzień dostawy i odbioru:</label>
                <div className="calendar-content">
                  <Field
                    as={DateRange}
                    locale={pl}
                    name="timeFrames"
                    editableDateInputs={true}
                    disabledDates={
                      !disabledDays || !disabledDays[values.assType]
                        ? []
                        : disabledDays[values.assType].map((timestamp) => {
                            return new Date(Number(timestamp));
                          })
                    }
                    onChange={(ranges: RangeKeyDict) => {
                      const { selection } = ranges;
                      const selectedRange = {
                        startDate: selection.startDate,
                        endDate: selection.endDate,
                        key: "selection",
                      };
                      setFieldValue("timeFrames", [
                        {
                          startDate: selectedRange.startDate,
                          endDate: selectedRange.endDate,
                          key: "selection",
                        },
                      ]);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={values.timeFrames}
                    minDate={addDays(new Date(), 1)}
                    showDateDisplay={true}
                    showPreview={true}
                  />
                  <div className="calendar-additional-text">
                    <p>
                      Dni zaznaczone na szaro (te których nie da sie wybrać)
                      oznaczają że dana atrakcja w tym terminie jest nie
                      dostępna.
                    </p>
                    <p>
                      Możesz spróbować wybrać innego dmuchańca i sprawdzić
                      dostępność w kalendarzu.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Field
                className="form-input-long"
                name="deliveryType"
                component={Select}
                placeholder="Wybierz rodzaj dostawy"
                options={[
                  {
                    value: "delivery",
                    label: "Zamówienie z dostawą na miejsce imprezy.",
                  },
                  {
                    value: "self-pickup",
                    label: "Zamówienie z odbiorem osobistym.",
                  },
                ]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("deliveryType", e);
                }}
              ></Field>

              <ErrorMessage
                name="deliveryType"
                component="div"
                className="validationError"
              />
            </div>
            {values.deliveryType === "delivery" && (
              <div className="delivery-info-content">
                <div>
                  <label htmlFor="addressCity"></label>
                  <Field
                    className="form-input-medium"
                    as={Input}
                    type="text"
                    placeholder="Miejscowość"
                    name="addressCity"
                    onChange={trimAndSet("addressCity", setFieldValue)}
                  />
                  <ErrorMessage
                    name="addressCity"
                    component="div"
                    className="validationError"
                  />
                </div>
                <div>
                  <label htmlFor="addressStreet"></label>
                  <Field
                    className="form-input-medium"
                    as={Input}
                    type="text"
                    placeholder="Ulica"
                    name="addressStreet"
                    onChange={trimAndSet("addressStreet", setFieldValue)}
                  />
                  <ErrorMessage
                    name="addressStreet"
                    component="div"
                    className="validationError"
                  />
                </div>
                <div>
                  <label htmlFor="addressHouseNumber"></label>
                  <Field
                    className="form-input-medium"
                    as={Input}
                    type="text"
                    placeholder="Numer budynku"
                    name="addressHouseNumber"
                    onChange={trimAndSet("addressHouseNumber", setFieldValue)}
                  />
                  <ErrorMessage
                    name="addressHouseNumber"
                    component="div"
                    className="validationError"
                  />
                </div>
                <div>
                  <label htmlFor="addressZipCode"></label>
                  <Field
                    className="form-input-medium"
                    as={Input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = e.target.value;
                      const prevValue = values.addressZipCode;
                      const updateValue = zipCodeFormatter(prevValue, newValue);
                      setFieldValue("addressZipCode", updateValue);
                    }}
                    type="text"
                    placeholder="Kod pocztowy"
                    name="addressZipCode"
                  />
                  <ErrorMessage
                    name="addressZipCode"
                    component="div"
                    className="validationError"
                  />
                </div>
              </div>
            )}
            <div className="time-pickers-content">
              <div className="time-picker">
                <label>Preferowana godzina dostawy:</label>
                <Field
                  className="form-input-short"
                  component={TimePicker}
                  // onChange={}
                  // defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                />
              </div>
              <div className="time-picker">
                <label>Preferowana godzina odbioru:</label>
                <Field
                  className="form-input-short"
                  component={TimePicker}
                  // onChange={}
                  // defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                />
              </div>
            </div>
            <div>
              <Field
                className="form-input-long"
                name="paymentType"
                component={Select}
                placeholder="Wybierz rodzaj płatności przy odbiorze"
                options={[
                  {
                    value: "card",
                    label: "Płatność kartą.",
                  },
                  {
                    value: "cash",
                    label: "Płatność gotówką.",
                  },
                ]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("paymentType", e);
                }}
              ></Field>

              <ErrorMessage
                name="paymentType"
                component="div"
                className="validationError"
              />
            </div>
            <div className="">
              <Field type="checkbox" name="checked" />
              Wyrażam zgodę na przetwarzanie moich danych osobowych przez XYZ w
              celu i zakresie koniecznym do udzielenia odpowiedzi na przesłanie
              zapytanie.*
              <ErrorMessage
                name="checked"
                component="div"
                className="validationError"
              />
            </div>

            <div>
              <Button
                type="primary"
                shape="round"
                style={{
                  backgroundColor: "#28D2FF",
                  color: "#000000",
                  fontWeight: "500",
                }}
                size={"large"}
                htmlType="submit"
              >
                REZERWUJ
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="footer-contact-information">
        <p className="footer-contact-text">
          W przypadku jakichkolwiek pytań, prosimy o kontakt pod numerem
          telefonu:
        </p>
        <p>
          <a className="footer-contact-information-phone" href="tel:165162781">
            +48 165 162 781
          </a>
        </p>
      </div>
    </div>
  );
};

export default FormikContactComponent;
