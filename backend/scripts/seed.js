// import dotenv from "dotenv";
// dotenv.config();
// import { connectDB } from "../src/db/index.js";
// import { User } from "../src/models/user.model.js";
// import { Ticket } from "../src/models/ticket.model.js";
// import { KbArticle } from "../src/models/kbArticle.model.js";
// import { generateTicketId } from "../src/utils/ticketIdGenerator.js";

// const run = async () => {
//   try {
//     await connectDB();
//     console.log("Seeding database...");

//     await User.deleteMany({});
//     await Ticket.deleteMany({});
//     await KbArticle.deleteMany({});

//     const admin = new User({ name: "Admin User", email: "admin@aidex.local", password: "password123", role: "Admin" });
//     await admin.save();

//     const agent = new User({ name: "Agent One", email: "agent@aidex.local", password: "password123", role: "Agent", departments: ["Technical Support"] });
//     await agent.save();

//     const customer = new User({ name: "Customer One", email: "customer@aidex.local", password: "password123", role: "Customer" });
//     await customer.save();

//     const ticket = new Ticket({
//       customer: customer._id,
//       title: "Sample issue: can't send email",
//       description: "SMTP fails after recent update",
//       ticketId: await generateTicketId(),
//       department: "Technical Support",
//       priority: "High"
//     });
//     await ticket.save();

//     const kb = new KbArticle({
//       title: "Reset password procedure",
//       content: "Steps to reset password...",
//       keywords: ["password", "reset"],
//       department: "Technical Support",
//       author: admin._id
//     });
//     await kb.save();

//     console.log("Seed complete:");
//     console.log("admin@aidex.local / password123");
//     console.log("agent@aidex.local / password123");
//     console.log("customer@aidex.local / password123");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// run();

// seedKB.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { KBArticle } from "./src/models/kb.model.js"; // adjust path if needed

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/aidex_db";

const articles = [
  {
    title: "How to Reset Your Password",
    department: "Technical Support",
    content: `
If you are unable to login:
1. Go to the login page and click "Forgot Password".
2. Enter your registered email address.
3. Check your email inbox for a reset link.
4. Follow the link and set a new password.
If you still face issues, ensure your account is activated.
    `,
  },
  {
    title: "Troubleshooting Login Issues",
    department: "Technical Support",
    content: `
Common login problems:
- Wrong email or password.
- Account locked due to too many failed attempts.
- Browser cache issues: clear cache and try again.
- Server downtime: check status page.
    `,
  },
  {
    title: "Configuring Email (SMTP Settings)",
    department: "Technical Support",
    content: `
To fix email sending issues:
1. Open project config file.
2. Set SMTP host, port, username, and password.
3. Ensure 'less secure apps' is enabled if using Gmail.
4. Test using the "Send Test Email" option.
    `,
  },
  {
    title: "Email Troubleshooting Guide",
    department: "Technical Support",
    content: `
If emails are not being sent:
- Verify SMTP credentials.
- Ensure the firewall is not blocking port 587/465.
- Check application logs for detailed error messages.
- Make sure 'from' email is verified with your mail provider.
    `,
  },
  {
    title: "Adding a Navigation Bar to Your App",
    department: "Frontend Support",
    content: `
To add a navbar:
1. Create a Navbar component in your frontend code.
2. Use a <nav> element with links.
3. Apply Tailwind classes for styling.
4. Import Navbar into App.jsx and include at the top.
    `,
  },
  {
    title: "Improving Layout with Tailwind",
    department: "Frontend Support",
    content: `
For better UI layout:
- Use grid or flexbox utilities in Tailwind.
- Apply responsive classes (sm:, md:, lg:).
- Keep components modular and reusable.
- Ensure accessibility and consistent spacing.
    `,
  },
];

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME || "aidex_db" });
    console.log("✅ Connected to MongoDB");

    await KBArticle.deleteMany({});
    console.log("🗑️ Cleared old KB articles");

    await KBArticle.insertMany(articles);
    console.log("📚 KB articles seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding KB articles:", err);
    process.exit(1);
  }
})();
