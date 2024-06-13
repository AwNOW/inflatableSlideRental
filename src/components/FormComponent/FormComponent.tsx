import React, { useEffect, useState } from "react";
import "./formComponent.css";
import Navigation from "../NavigationComponent/Navigation";
import ContactDetails from "../ContactDetailsComponent/ContactDetails";
import Bubbles from "../BubblesComponent/Bubbles";
import ModalConfirmation from "./ModalConfirmation";

import picAssoTypeA from "../../images/zamekA.png";
import picAssoTypeB from "../../images/zamekB.png";
import picAssoTypeC from "../../images/zamekC.png";
import picAssoTypeD from "../../images/zamekD.png";
import picAssoTypeE from "../../images/zamekE.png";
import picAssoTypeF from "../../images/zamekF.png";

import { v4 as uuidv4 } from "uuid";
import { writeBatch, doc, collection, getDocs } from "firebase/firestore";
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

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { pl } from "date-fns/locale";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import type { RangeKeyDict } from "react-date-range";
import { TimePicker, Input, Select, Checkbox } from "antd";
import dayjs from "dayjs";

import {
  postalCodeValidation,
  DisabledDays,
  OrderData,
  confirmedOrderData,
  getBookedDays,
  getDisabledDays,
} from "./formHelpers";

const bubbleArr = [
  {
    top: "220px",
    left: "-380px",
    height: "200px",
    width: "200px",
    borderRadius: "200px",
  },
  {
    top: "-40px",
    left: "-340px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "390px",
    left: "-320px",
    height: "150px",
    width: "150px",
    borderRadius: "150px",
  },
];

const picAssoTypesObj: { [key in AssortmentTypes]: string } = {
  assoTypeA: picAssoTypeA,
  assoTypeB: picAssoTypeB,
  assoTypeC: picAssoTypeC,
  assoTypeD: picAssoTypeD,
  assoTypeE: picAssoTypeE,
  assoTypeF: picAssoTypeF,
};

type AssortmentTypes =
  | "assoTypeA"
  | "assoTypeB"
  | "assoTypeC"
  | "assoTypeD"
  | "assoTypeE"
  | "assoTypeF";

interface FormikOrderFields {
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  email: string;
  assoType: AssortmentTypes | null;
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
  checked: boolean;
}

interface FirestoreOrderFields {
  formikFields: FormikOrderFields;
  currentDate: Date;
}

const FormikContactComponent: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit: (
    values: FormikOrderFields,
    formikHelpers: FormikHelpers<FormikOrderFields>
  ) => void | Promise<void> = async (values, { setSubmitting, resetForm }) => {
    await writeToDatabase(values);
    setSubmitting(false);
    resetForm(); // Reset the form
    setShowModal(true);
  };
  const writeToDatabase = async (values: FormikOrderFields) => {
    const orderId = uuidv4();
    const orderRef = doc(firestore, "orders", orderId);
    const personalDetailsRef = doc(firestore, "ordersPersonalDetails", orderId);

    const batch = writeBatch(firestore);

    batch.set(orderRef, {
      assoType: values.assoType,
      deliveryTime: values.deliveryTime,
      pickUpTime: values.pickUpTime,
      deliveryType: values.deliveryType,
      timeFrames: [
        values.timeFrames[0].startDate,
        values.timeFrames[0].endDate,
      ],
      currentDate: new Date(),
    });

    let addressZipCode = values.addressZipCode;
    let addressCity = values.addressCity;
    let addressStreet = values.addressStreet;
    let addressHouseNumber = values.addressHouseNumber;

    if (values.deliveryType === "self-pickup") {
      addressZipCode = "";
      addressCity = "";
      addressStreet = "";
      addressHouseNumber = "";
    }

    batch.set(personalDetailsRef, {
      clientName: values.clientName,
      clientSurname: values.clientSurname,
      phoneNr: values.phoneNr,
      email: values.email,
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
      .matches(/^[A-Za-zŁłÓóŻżĆćŃńĄąĘęŚśŹź]+$/, {
        message: "Cyfry i znaki specjalne są zabronione",
      })
      .required("Proszę podać imię.")
      .max(20, "Proszę podać imię nie przekraczające 20 znaków."),
    clientSurname: Yup.string()
      .matches(/^[A-Za-zŁłÓóŻżĆćŃńĄąĘęŚśŹź]+$/, {
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
    email: Yup.string()
      .required("Proszę podać adres email.")
      .email("Proszę podać poprawny adres email."),
    assoType: Yup.string().required("Proszę wybrać rodzaj dmuchanej atrakcji."),
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
    deliveryTime: Yup.number().required("Proszę podać czas dostawy."),
    pickUpTime: Yup.number().required("Proszę podać czas odbioru."),
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
    ) => Promise<void | FormikErrors<FormikOrderFields>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = e.target.value.replace(/\s/g, "");
      setFieldValue(fieldName, trimmedValue);
    };
  };

  //disabled dates
  const [disabledDays, setDisabledDays] = useState<DisabledDays>();
  const assoAmounts: { [key: string]: number } = {
    assoTypeA: 1,
    assoTypeB: 1,
    assoTypeC: 1,
    assoTypeD: 1,
    assoTypeE: 1,
    assoTypeF: 1,
  };
  useEffect(() => {
    const ordersCollection = collection(firestore, "orders");
    const confirmedOrdersCollection = collection(firestore, "confirmedOrders");
    const promise = getDocs(ordersCollection);
    promise.then((snapshot) => {
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          assoType: data.assoType,
          timeFrames: data.timeFrames,
        } as OrderData;
      });

      getDocs(confirmedOrdersCollection).then((snapshot) => {
        const confirmedOrdersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            adminConfirmation: data.adminConfirmation,
          } as confirmedOrderData;
        });

        const reservationInfo = getBookedDays(ordersData, confirmedOrdersData);

        const disabledDaysResult = getDisabledDays(
          reservationInfo,
          assoAmounts
        );
        setDisabledDays(disabledDaysResult);
      });
    });
  }, []);

  // Exception Delivery Days and Delivery Types
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
    assoType: string | null,
    deliveryType: string | null,
    deliveryDayOfWeek: number | undefined,
    pickUpDayOfWeek: number | undefined
  ) => {
    if (
      deliveryType === null ||
      assoType === null ||
      deliveryDayOfWeek === undefined ||
      pickUpDayOfWeek === undefined
    ) {
      return;
    }
    const action1 = deliveryType === "delivery" ? "dostawy " : "odbioru ";
    const action2 = deliveryType === "delivery" ? "odbioru" : "zwrotu";

    if (
      (deliveryDayOfWeek === 6 && pickUpDayOfWeek === 6) ||
      (deliveryDayOfWeek === 0 && pickUpDayOfWeek === 0)
    ) {
      return (
        <div className="exception-delivery-text">
          Poniższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek]}</strong> - dnia {action1}
          oraz {action2} dmuchańca.
        </div>
      );
    } else if (
      (deliveryDayOfWeek === 6 && pickUpDayOfWeek !== 6) ||
      (deliveryDayOfWeek === 0 && pickUpDayOfWeek !== 0)
    ) {
      return (
        <div className="exception-delivery-text">
          Poniższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek]}</strong> - dnia {action1}
          dmuchańca oraz <strong>{daysOfWeekArr[pickUpDayOfWeek]}</strong> -
          dnia {action2}.
        </div>
      );
    } else {
      return (
        <div className="exception-delivery-text">
          Dostarczenie dmuchańca najprawdopodniej odbędzie się dzień wcześniej w
          godzinach wieczornych. <br />
          Wiąże się to z samodzielnym rozłożeniem sprzętu i uruchomieniem go.
          <br />
          Poniższe godziny dotyczą{" "}
          <strong>{daysOfWeekArr[deliveryDayOfWeek - 1]}</strong> - dnia{" "}
          {action1}
          dmuchańca oraz <strong>{daysOfWeekArr[pickUpDayOfWeek]}</strong> -
          dnia {action2}.
        </div>
      );
    }
  };

  return (
    <div>
      <nav>
        <Navigation />
      </nav>
      <h1 className="main-content-heading">Rezerwacja</h1>
      <Formik
        initialValues={
          {
            clientName: "",
            clientSurname: "",
            phoneNr: "",
            email: "",
            assoType: null,
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
            checked: false,
          } as FormikOrderFields
        }
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="upper-form-content">
              <div className="upper-form-fields">
                <div>
                  <div>
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
                      as={Input}
                      type="text"
                      placeholder="Adres e-mail (wymagane)"
                      name="email"
                      onChange={trimAndSet("email", setFieldValue)}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="validationError"
                    />
                  </div>
                </div>

                <div>
                  <Field
                    className="form-input-long"
                    name="assoType"
                    as={Select}
                    placeholder="Wybierz rodzaj dmuchanej atrakcji"
                    options={[
                      { value: "assoTypeA", label: "Zamek La Palma" },
                      {
                        value: "assoTypeB",
                        label: "Zamek Combo Slide",
                      },
                      { value: "assoTypeC", label: "Zamek Żyrafa" },
                      { value: "assoTypeD", label: "Zamek Kangurek" },
                      {
                        value: "assoTypeE",
                        label: "Zamek Słonik Maksa",
                      },
                      { value: "assoTypeF", label: "Zamek Bajtel" },
                    ]}
                    onChange={(e: string) => {
                      setFieldValue("assoType", e);
                    }}
                  />
                  <ErrorMessage
                    name="assoType"
                    component="div"
                    className="validationError"
                  />
                </div>

                <label className="form-label">
                  Wybierz zakres dni rezerwacji:
                </label>
                <div>
                  <div className="calendar-container">
                    <div className="calendar">
                      {!values.assoType && (
                        <div className="calendar-content-disabled">
                          Aby zobaczyć dostępne terminy, proszę wybrać rodzaj
                          dmuchanej atrakcji.
                        </div>
                      )}
                      <div>
                        <Field
                          as={DateRange}
                          locale={pl}
                          name="timeFrames"
                          editableDateInputs={true}
                          disabledDates={
                            values.assoType &&
                            disabledDays &&
                            disabledDays[values.assoType]
                              ? disabledDays[values.assoType].map(
                                  (timestamp: string) => {
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
                          }}
                          moveRangeOnFirstSelection={false}
                          ranges={values.timeFrames}
                          minDate={addDays(new Date(), 1)}
                          showDateDisplay={true}
                        />
                      </div>
                      <div className="form-img-container-small">
                        {values.assoType && (
                          <img
                            className="img"
                            src={picAssoTypesObj[values.assoType]}
                            alt="dmuchanec1"
                          />
                        )}
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
                      <Field
                        className="form-input-medium"
                        as={Input}
                        type="text"
                        placeholder="Miejscowość"
                        name="addressCity"
                      />
                      <ErrorMessage
                        name="addressCity"
                        component="div"
                        className="validationError"
                      />
                    </div>
                    <div>
                      <Field
                        className="form-input-medium"
                        as={Input}
                        type="text"
                        placeholder="Ulica"
                        name="addressStreet"
                      />
                      <ErrorMessage
                        name="addressStreet"
                        component="div"
                        className="validationError"
                      />
                    </div>
                    <div>
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
                {getDeliveryDay(
                  values.assoType,
                  values.deliveryType,
                  values.timeFrames[0]?.startDate?.getDay(),
                  values.timeFrames[0]?.endDate?.getDay()
                )}
                <div className="time-pickers-content">
                  <div className="time-picker">
                    {values.deliveryType === "delivery" ? (
                      <label className="form-label">
                        Preferowana godzina dostawy:
                      </label>
                    ) : (
                      <label className="form-label">
                        Preferowana godzina odbioru:
                      </label>
                    )}
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
                    {values.deliveryType === "delivery" ? (
                      <label className="form-label">
                        Preferowana godzina odbioru:
                      </label>
                    ) : (
                      <label className="form-label">
                        Preferowana godzina zwrotu:
                      </label>
                    )}
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
              </div>
              <div className="form-img-container">
                <Bubbles bubbles={bubbleArr} />
                {values.assoType && (
                  <img
                    className="img"
                    src={picAssoTypesObj[values.assoType]}
                    alt="dmuchanec1"
                  />
                )}
              </div>
            </div>

            <div className="checkbox-statement">
              <Field as={Checkbox} name="checked" checked={values.checked} />{" "}
              Wyrażam zgodę na przetwarzanie moich danych osobowych przez{" "}
              <strong>Hulańce dla Bajtli</strong> w celu i zakresie koniecznym
              do udzielenia odpowiedzi na przesłanie zapytanie.*
              <ErrorMessage
                name="checked"
                component="div"
                className="validationError"
              />
            </div>
            <div className="lower-form-content">
              <button className="button-primary" type="submit">
                REZERWUJ
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {showModal && <ModalConfirmation setShowModal={setShowModal} />}
    </div>
  );
};

export default FormikContactComponent;
