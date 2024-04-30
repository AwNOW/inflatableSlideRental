import "./formComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";
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
import { TimePicker, Input, Button, Select, Checkbox } from "antd";
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
    top: "350px",
    left: "10px",
    height: "200px",
    width: "200px",
    borderRadius: "200px",
  },
  {
    top: "-50px",
    left: "-30px",
    height: "450px",
    width: "450px",
    borderRadius: "450px",
  },
  {
    top: "550px",
    left: "100px",
    height: "150px",
    width: "150px",
    borderRadius: "150px",
  },
];

interface OrderForm {
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  assType: string | null;
  deliveryType: string | null;
  timeFrames: {
    startDate?: Date | null;
    endDate?: Date | null;
    key?: string;
  }[];
  addressZipCode: string;
  addressCity: string;
  addressStreet: string;
  addressHouseNumber: string;
  deliveryTime: number | null;
  pickUpTime: number | null;
  paymentType: string | null;
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
      deliveryTime: values.deliveryTime,
      pickUpTime: values.pickUpTime,
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
    deliveryTime: Yup.object().required("Proszę podać czas dostawy."),
    pickUpTime: Yup.object().required("Proszę podać czas odbioru."),
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

  const [disabledDays, setDisabledDays] = useState<DisabledDays>();

  const assAmounts: { [key: string]: number } = {
    typeA: 3,
    typeB: 5,
    typeC: 4,
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

  // Exception Delivery Days
  const [deliveryExceptionText, setDeliveryExceptionText] =
    useState<React.ReactNode>(null);

  const daysOfWeekArr = [
    "niedzieli",
    "poniedziałku",
    "wtorku",
    "środy",
    "czwartku",
    "piątku",
    "soboty",
  ];

  const getDeliveryDay = (
    deliveryDayOfWeek: number,
    pickUpDayOfWeek: number
  ): void => {
    if (
      (deliveryDayOfWeek === 6 && pickUpDayOfWeek === 6) ||
      (deliveryDayOfWeek === 0 && pickUpDayOfWeek === 0)
    ) {
      setDeliveryExceptionText(
        <div className="exception-delivery-text">
          Powyższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek]}</strong> - dnia dostawy
          oraz odbioru dmuchańca.
        </div>
      );
    } else if (
      (deliveryDayOfWeek === 6 && pickUpDayOfWeek !== 6) ||
      (deliveryDayOfWeek === 0 && pickUpDayOfWeek !== 0)
    ) {
      setDeliveryExceptionText(
        <div className="exception-delivery-text">
          Powyższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek]}</strong> - dnia dostawy
          dmuchańca oraz <strong>{daysOfWeekArr[pickUpDayOfWeek]}</strong> -
          dnia odbioru.
        </div>
      );
    } else {
      setDeliveryExceptionText(
        <div className="exception-delivery-text">
          Powyższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek - 1]}</strong> - dnia dostawy
          dmuchańca oraz <strong>{daysOfWeekArr[pickUpDayOfWeek]}</strong> -
          dnia odbioru.
        </div>
      );
    }
  };

  return (
    <div>
      <nav>
        <NavigationComponent />
      </nav>
      <h1 className="main-content-heading">Rezerwacja</h1>
      <Formik
        initialValues={
          {
            clientName: "",
            clientSurname: "",
            phoneNr: "",
            assType: null,
            deliveryType: null,
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
            deliveryTime: null,
            pickUpTime: null,
            paymentType: null,
            checked: false,
          } as OrderForm
        }
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <div className="upper-form-content">
              <div>
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
                    value={values.assType}
                    options={[
                      { value: "typeA", label: "Zamek A" },
                      { value: "typeB", label: "Zamek B" },
                      { value: "typeC", label: "Zamek C" },
                    ]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("assType", e);
                    }}
                  />
                  <ErrorMessage
                    name="assType"
                    component="div"
                    className="validationError"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Wybierz dzień dostawy i odbioru:
                  </label>
                  <div className="calendar-container">
                    <div className="calendar">
                      {!values.assType && (
                        <div className="calendar-content-disabled"></div>
                      )}
                      <div>
                        <Field
                          as={DateRange}
                          disabled={true}
                          locale={pl}
                          name="timeFrames"
                          editableDateInputs={true}
                          disabledDates={
                            values.assType &&
                            disabledDays &&
                            disabledDays[values.assType]
                              ? disabledDays[values.assType].map(
                                  (timestamp: string) => {
                                    console.log(timestamp);
                                    return new Date(Number(timestamp));
                                  }
                                )
                              : []
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
                            getDeliveryDay(
                              selectedRange.startDate!.getDay(),
                              selectedRange.endDate!.getDay()
                            );
                          }}
                          moveRangeOnFirstSelection={false}
                          ranges={values.timeFrames}
                          minDate={addDays(new Date(), 1)}
                          showDateDisplay={true}
                        />
                      </div>
                    </div>
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
                  <div>
                    <Field
                      className="form-input-long"
                      name="deliveryType"
                      value={values.deliveryType}
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
                    />
                  </div>

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
                        onChange={trimAndSet(
                          "addressHouseNumber",
                          setFieldValue
                        )}
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
                        type="text"
                        placeholder="Kod pocztowy"
                        name="addressZipCode"
                        as={Input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newValue = e.target.value;
                          const prevValue = values.addressZipCode;
                          const updateValue = zipCodeFormatter(
                            prevValue,
                            newValue
                          );
                          setFieldValue("addressZipCode", updateValue);
                        }}
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
                    <label className="form-label">
                      Preferowana godzina dostawy:
                    </label>
                    <Field
                      className="form-input-short"
                      component={TimePicker}
                      placeholder="00:00"
                      name="deliveryTime"
                      value={
                        values.deliveryTime ? dayjs(values.deliveryTime) : null
                      }
                      defaultOpenValue={dayjs("00:00:00", "HH:mm")}
                      format="HH:mm"
                      onChange={(value: dayjs.Dayjs) => {
                        if (value !== null) {
                          setFieldValue("deliveryTime", value.valueOf());
                        } else {
                          setFieldValue("deliveryTime", null);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="deliveryTime"
                      component="div"
                      className="validationError"
                    />
                  </div>
                  <div className="time-picker">
                    <label className="form-label">
                      Preferowana godzina odbioru:
                    </label>
                    <Field
                      className="form-input-short"
                      component={TimePicker}
                      placeholder="00:00"
                      name="pickUpTime"
                      value={
                        values.pickUpTime ? dayjs(values.pickUpTime) : null
                      }
                      defaultOpenValue={dayjs("00:00:00", "HH:mm")}
                      format="HH:mm"
                      onChange={(value: dayjs.Dayjs) => {
                        if (value !== null) {
                          setFieldValue("pickUpTime", value.valueOf());
                        } else {
                          setFieldValue("pickUpTime", null);
                        }
                      }}
                    />

                    <ErrorMessage
                      name="pickUpTime"
                      component="div"
                      className="validationError"
                    />
                  </div>
                </div>
                {deliveryExceptionText}
                <div>
                  <Field
                    className="form-input-long"
                    name="paymentType"
                    value={values.paymentType}
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
                  />

                  <ErrorMessage
                    name="paymentType"
                    component="div"
                    className="validationError"
                  />
                </div>
              </div>
              <div className="form-img-container">
                <BubblesComponent bubbles={bubbleArr} />
                {values.assType && (
                  <img className="img" src={obrazek} alt="dmuchanec1" />
                )}
              </div>
            </div>

            <div className="checkbox-statement">
              <Field as={Checkbox} name="checked" checked={values.checked} />{" "}
              Wyrażam zgodę na przetwarzanie moich danych osobowych przez XYZ w
              celu i zakresie koniecznym do udzielenia odpowiedzi na przesłanie
              zapytanie.*
              <ErrorMessage
                name="checked"
                component="div"
                className="validationError"
              />
            </div>
            <div className="lower-form-content">
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
            </div>
          </Form>
        )}
      </Formik>
      <ContactDetailsComponent />
    </div>
  );
};

export default FormikContactComponent;
