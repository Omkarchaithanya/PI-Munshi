import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";

async function runQA() {
  console.log("=== Starting Playwright Browser QA for Pi Munshi Paytm Redesign ===");
  
  if (!existsSync("screenshots")) {
    mkdirSync("screenshots", { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  console.log("Navigating to http://localhost:8080/ ...");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const title = await page.title();
  const bodyText = await page.locator("body").innerText();
  console.log("Page Title:", title);
  console.log("Console Errors Detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Errors:", consoleErrors);
  }

  // 1. Verify Shopkeeper Mode (Primary View)
  console.log("1. Capturing Desktop Shopkeeper Mode...");
  const hasGreeting = bodyText.includes("रमेश") || bodyText.includes("Namaste");
  const hasQuickActions = bodyText.includes("पैसे प्राप्त करें") || bodyText.includes("Receive Money");
  const hasRupee = bodyText.includes("₹");
  console.log("Shopkeeper UI checks:", { hasGreeting, hasQuickActions, hasRupee });

  await page.screenshot({ path: "screenshots/desktop-shopkeeper.png", fullPage: true });
  console.log("Saved: screenshots/desktop-shopkeeper.png");

  // 2. Click FSE Mode button
  console.log("2. Switching to FSE / Field Ops Mode...");
  const fseButton = page.locator('button:has-text("FSE")');
  if (await fseButton.count() > 0) {
    await fseButton.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/desktop-fse.png", fullPage: true });
    console.log("Saved: screenshots/desktop-fse.png");
  }

  // 3. Click Judge / Engine Mode button
  console.log("3. Switching to Judge / Technical Mode...");
  const judgeButton = page.locator('button:has-text("जज")');
  if (await judgeButton.count() > 0) {
    await judgeButton.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/desktop-judge.png", fullPage: true });
    console.log("Saved: screenshots/desktop-judge.png");
  }

  // 4. Mobile Viewport Check (390 x 844 iPhone 14 / Android viewport)
  console.log("4. Testing Mobile Viewport (390x844)...");
  await page.setViewportSize({ width: 390, height: 844 });
  // Switch back to shopkeeper mode for mobile
  const shopkeeperBtn = page.locator('button:has-text("दुकानदार")');
  if (await shopkeeperBtn.count() > 0) {
    await shopkeeperBtn.first().click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: "screenshots/mobile-shopkeeper.png", fullPage: true });
  console.log("Saved: screenshots/mobile-shopkeeper.png");

  await browser.close();
  console.log("=== Playwright QA Finished Successfully ===");
}

runQA().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});
