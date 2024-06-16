
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hulancedlabajtli@gmail.com",
    pass: "hmja uvno iwag jnvc",
  },
});

// Function to handle sending email on document creation
exports.sendEmailOnRequestCreation = functions
  .region("europe-central2")
  .firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderId = context.params.orderId;
    console.log(orderId);

    // Get the personData document by orderId
    const personDoc = await admin.firestore()
      .collection("ordersPersonalDetails").doc(orderId).get();

    if (!personDoc.exists) {
      console.log(`No personData found for orderId: ${orderId}`);
      return;
    }

    const personData = personDoc.data();
    const clientName = personData?.clientName;

    // Send confirmation email to the client
    const clientMailOptions = {
      from: "hulancedlabajtli@gmail.com",
      to: personData?.email,
      subject: "Potwierdzenie złożenia rezerwacji",
      html: `<p><b>Cześć ${clientName}!</b></p>
    <p>Dziękujemy za złożenie rezerwacji. Przystąpimy do jej rozpatrzenia
    jak najszybciej. Wkrótce otrzymasz e-mail z potwierdzeniem
    zamówienia. </p><p>Pozdrawiamy,<br><br> Zespół Hulańce dla
    Bajtli</p>`,
    };

    transporter.sendMail(clientMailOptions, (error:Error | null) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Client email sent successfully!");
    });

    // Send notification email to admin
    const adminMailOptions = {
      from: "hulancedlabajtli@gmail.com",
      to: "hulancedlabajtli@gmail.com",
      subject: "Potwierdzenie złożenia rezerwacji",
      html: `<p><b>Elko Łukasz!</b></p>
    <p>Nowe zamówienie zostało złożone :D</p>`,
    };

    transporter.sendMail(adminMailOptions, (error:Error | null) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Admin notification email sent successfully!");
    });
  });


// Function to handle sending email on document creation
// confirmedOrders collection
exports.sendEmailOnRequestConfirmation = functions
  .region("europe-central2")
  .firestore
  .document("confirmedOrders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderId = context.params.orderId;
    console.log(orderId);

    // Get the personData document by orderId
    const personDoc = await admin.firestore()
      .collection("ordersPersonalDetails").doc(orderId).get();

    if (!personDoc.exists) {
      console.log(`No personData found for orderId: ${orderId}`);
      return;
    }

    const personData = personDoc.data();
    const clientName = personData?.clientName;

    // Send confirmation email to the client
    const clientMailOptions = {
      from: "hulancedlabajtli@gmail.com",
      to: personData?.email,
      subject: "Potwierdzenie rezerwacji",
      html: ` <p><b>Cześć ${clientName}!</b></p>
      <p>Dziękujemy za złożenie rezerwacji. Z przyjemnością potwierdzamy, że
      Twoje zamówienie zostało pozytywnie rozpatrzone. W razie
      jakichkolwiek pytań, prosimy o kontakt mailowy lub telefoniczny.</p>
      <p>Zapraszamy również do śledzenia nas na naszych profilach
      w mediach społecznościowych, aby być na bieżąco z nowościami
      i promocjami.</p> <p>Pozdrawiamy,<br> Zespół Hulańce dla Bajtli</p>`,
    };

    transporter.sendMail(clientMailOptions, (error:Error | null) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Client email with confirmation sent successfully!");
    });
  });
