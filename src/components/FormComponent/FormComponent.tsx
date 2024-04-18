import "./formComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../index";
import {
  Formik,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikErrors,
  Form,
  validateYupSchema,
} from "formik";
import * as Yup from "yup";

import React, { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { pl } from "date-fns/locale";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import type { RangeKeyDict } from "react-date-range";

interface OrderForm {
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  assType: string;
  deliveryType: string;
  timeFrames: [Date, Date];
  addressZipCode: string;
  addressCity: string;
  addressHouseNumber: string;
  paymentType: string;
  checked: boolean;
}
interface Props {
  onDateChange: (startDate: Date, endDate: Date) => void;
}

// ZIP CODE validation function
const postalCodes = require("postal-codes-js");
const countryCode = "PL"; // ISO 3166-1 alpha-2 or alpha-3 country code as string.

const postalCodeValidation = (zipCode: string) => {
  const message = postalCodes.validate(countryCode, zipCode);
  if (message === true) {
    return true;
  } else {
    return false;
  }
};

const FormikContactComponent: React.FC = () => {
  const handleFormSubmit: (
    values: OrderForm,
    formikHelpers: FormikHelpers<OrderForm>
  ) => void | Promise<any> = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
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
      tripTimeFrames: [values.timeFrames[0], values.timeFrames[1]],
    });

    let addressZipCode = values.addressZipCode;
    let addressCity = values.addressCity;
    let addressHouseNumber = values.addressHouseNumber;

    if (values.assType === "self-pickup") {
      addressZipCode = "";
      addressCity = "";
      addressHouseNumber = "";
    }

    batch.set(personalDetailsRef, {
      clientName: values.clientName,
      clientSurname: values.clientSurname,
      phoneNr: values.phoneNr,
      paymentType: values.paymentType,
      addressZipCode: addressZipCode,
      addressCity: addressCity,
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
          .required("Proszę podać kod pocztowy")
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

  //trimmerFunc
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

  //calendar
  const tomorrow = addDays(new Date(), 1);
  const [state, setState] = useState([
    {
      startDate: tomorrow,
      endDate: tomorrow,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    const selectedRange = {
      startDate: selection.startDate || new Date(), // If undefined, default to new Date()
      endDate: selection.endDate || new Date(), // If undefined, default to new Date()
      key: "selection",
    };

    setState([selectedRange]);
  };

  return (
    <div>
      <NavigationComponent />
      <Formik
        initialValues={{
          clientName: "",
          clientSurname: "",
          phoneNr: "",
          assType: "",
          deliveryType: "",
          timeFrames: [new Date(), new Date()],
          addressZipCode: "",
          addressCity: "",
          addressHouseNumber: "",
          paymentType: "",
          checked: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          setFieldTouched,
          setValues,
          setFieldValue,
          isValid,
          resetForm,
        }) => (
          <Form>
            <div>
              <label htmlFor="clientName"></label>
              <Field
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
              <label htmlFor="assType">
                Wybierz rodzaj dmuchanej atrakcji:
              </label>
              <Field name="assType" as="select">
                <option value="typeA">Zamek A</option>
                <option value="typeB">Zamek B</option>
                <option value="" disabled hidden>
                  Rodzaje atrakcji
                </option>
              </Field>

              <ErrorMessage
                name="assType"
                component="div"
                className="validationError"
              />
            </div>
            <div></div>
            <div>
              <label htmlFor="assType">Wybierz rodzaj dostawy:</label>
              <Field name="deliveryType" as="select">
                <option value="delivery">
                  Zamówienie z dostawą na miejsce imprezy.
                </option>
                <option value="self-pickup">
                  Zamówienie z odbiorem osobistym.
                </option>
                <option value="" disabled hidden></option>
              </Field>

              <ErrorMessage
                name="deliveryType"
                component="div"
                className="validationError"
              />
            </div>

            {values.deliveryType === "delivery" && (
              <div>
                <div>
                  <label htmlFor="addressZipCode"></label>
                  <Field
                    as="input"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = e.target.value;
                      const prevValue = values.addressZipCode;
                      const updateValue = zipCodeFormatter(prevValue, newValue);
                      setFieldValue("addressZipCode", updateValue);
                      console.log(newValue);
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
                <div>
                  <label htmlFor="addressCity"></label>
                  <Field
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
                  <label htmlFor="addressHouseNumber"></label>
                  <Field
                    type="text"
                    placeholder="Numer budynku"
                    name="addressHouseNumber"
                    onChange={trimAndSet("addressHouseNumber", setFieldValue)}
                  />
                  <ErrorMessage name="addressHouseNumber" component="div" />
                </div>
              </div>
            )}
            <Field
              as={DateRange}
              locale={pl}
              name=""
              editableDateInputs={true}
              onChange={(ranges: RangeKeyDict) => {
                  const { selection } = ranges;
                  const selectedRange = {
                    startDate: selection.startDate || new Date(), // If undefined, default to new Date()
                    endDate: selection.endDate || new Date(), // If undefined, default to new Date()
                    key: "selection",
                  };

                  setFieldValue("timeFrames", [selectedRange.startDate, selectedRange.endDate]);
                }
              }
              moveRangeOnFirstSelection={false}
              ranges={state}
              minDate={tomorrow}
              showDateDisplay={true}
              showPreview={true}
            />

            <div>
              <label htmlFor="paymentType">Wybierz rodzaj płatności:</label>
              <Field name="paymentType" as="select">
                <option value="card">Płatność kartą</option>
                <option value="cash">Płatność gotówką</option>
                <option value="" disabled hidden></option>
              </Field>

              <ErrorMessage
                name="paymentType"
                component="div"
                className="validationError"
              />
            </div>
            <label>
              <Field type="checkbox" name="checked" />
              Wyrażam zgodę na przetwarzanie moich danych osobowych przez XYZ w
              celu i zakresie koniecznym do udzielenia odpowiedzi na przesłanie
              zapytanie.*
            </label>

            <ErrorMessage
              name="checked"
              component="div"
              className="validationError"
            />

            <div>
              <button type="submit">Wyślij wiadomość</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FormikContactComponent;
