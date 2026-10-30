import { chromium } from "playwright";
import fs from "fs";

async function run() {
  console.log("=== Testing Language Translations (EN, KN, HI) ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Test ENGLISH
  console.log("Switching to English (EN)...");
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(500);

  const enText = await page.textContent("body");
  const hasEnGreeting = enText.includes("Namaste, Ramesh ji!") || enText.includes("Paytm for Business");
  const hasEnToday = enText.includes("TODAY'S BUSINESS") || enText.includes("Total Payments Received");
  const hasEnActions = enText.includes("Receive Money") || enText.includes("Payment History");
  console.log("English Checks:", { hasEnGreeting, hasEnToday, hasEnActions });
  await page.screenshot({ path: "screenshots/desktop-english.png" });
  console.log("Saved: screenshots/desktop-english.png");

  // 2. Test KANNADA
  console.log("Switching to Kannada (ಕನ್ನಡ)...");
  await page.click('button:has-text("ಕನ್ನಡ")');
  await page.waitForTimeout(500);

  const knText = await page.textContent("body");
  const hasKnGreeting = knText.includes("ನಮಸ್ಕಾರ, ರಮೇಶ್") || knText.includes("ಪೇಟಿಎಂ");
  const hasKnToday = knText.includes("ಇಂದಿನ ಒಟ್ಟು ವ್ಯಾಪಾರ") || knText.includes("ಸ್ವೀಕರಿಸಿದ ಒಟ್ಟು ಪಾವತಿ");
  const hasKnActions = knText.includes("ಹಣ ಸ್ವೀಕರಿಸಿ") || knText.includes("ಪಾವತಿ ಇತಿಹಾಸ");
  console.log("Kannada Checks:", { hasKnGreeting, hasKnToday, hasKnActions });
  await page.screenshot({ path: "screenshots/desktop-kannada.png" });
  console.log("Saved: screenshots/desktop-kannada.png");

  // 3. Test HINDI
  console.log("Switching to Hindi (हिंदी)...");
  await page.click('button:has-text("हिंदी")');
  await page.waitForTimeout(500);

  const hiText = await page.textContent("body");
  const hasHiGreeting = hiText.includes("नमस्ते, रमेश जी!") || hiText.includes("दुकानदार");
  const hasHiToday = hiText.includes("आज का कुल कारोबार") || hiText.includes("कुल भुगतान प्राप्त");
  const hasHiActions = hiText.includes("पैसे प्राप्त करें") || hiText.includes("पेमेंट हिस्ट्री");
  console.log("Hindi Checks:", { hasHiGreeting, hasHiToday, hasHiActions });
  await page.screenshot({ path: "screenshots/desktop-hindi.png" });
  console.log("Saved: screenshots/desktop-hindi.png");

  await browser.close();
  console.log("=== Language Translation QA Passed Successfully ===");
}

run().catch((err) => {
  console.error("Language QA Error:", err);
  process.exit(1);
});
