import { test, expect } from "@playwright/test"

test.describe("alert", () => {
  test.beforeEach(async ({ page }) => {
    // open index page
    await page.goto("http://localhost:3000/")
    await page.waitForLoadState("domcontentloaded")
    await (await page.waitForSelector("[role=add-new-card]")).click()
  })

  test("should display alert if user doesnt fill the title", async ({
    page,
  }) => {
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Please fill the title")
      await dialog.dismiss()
    })

    await (await page.waitForSelector("#submitNewCard")).click()
  })

  test("should display alert if user doesnt choose the timezone", async ({
    page,
  }) => {
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("You must choose a timezone")
      await dialog.dismiss()
    })

    await page.fill("#titleCard", "Singapore City")
    await (await page.locator("#submitNewCard")).click()
  })

  test("should new card created", async ({ page }) => {
    await page.fill("#titleCard", "Singapore City")
    await page.locator("#timeZoneCard").selectOption("Asia/Singapore")
    await (await page.waitForSelector("#submitNewCard")).click()

    const otherTimeCont = await page.locator(".otherTime-card")

    await expect(otherTimeCont).toHaveCount(1)
    await expect(
      await page.locator(".otherTime-card").nth(0).locator("h1")
    ).toHaveText("Singapore")

    await expect(
      await page.locator(".otherTime-card").nth(0).locator("h2")
    ).toHaveText("Singapore City")
  })

  test("should display alert for already selected timezone", async ({
    page,
  }) => {
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("You have already added this timezone")
      await dialog.dismiss()
    })

    await page.fill("#titleCard", "Jakarta")
    await page.locator("#timeZoneCard").selectOption("Asia/Singapore")
    await (await page.waitForSelector("#submitNewCard")).click()

    const otherTimeCont = await page.locator(".otherTime-card")

    // Expect to have 1 card
    await expect(otherTimeCont).toHaveCount(1)
  })

  test("should limit to 4 cards", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Limit to 4 cards")
      await dialog.dismiss()
    })

    // Create card no 1
    await page.fill("#titleCard", "Singgapuurr")
    await page.locator("#timeZoneCard").selectOption("Asia/Singapore")
    await (await page.waitForSelector("#submitNewCard")).click()

    await expect(await page.locator(".otherTime-card")).toHaveCount(1)

    // Create card no 2
    await page.locator("[role=add-new-card]").click()
    await page.fill("#titleCard", "Tokyo - Japan")
    await page.locator("#timeZoneCard").selectOption("Asia/Tokyo")
    await (await page.locator("#submitNewCard")).click()

    await expect(await page.locator(".otherTime-card")).toHaveCount(2)

    // Create card no 3
    await page.locator("[role=add-new-card]").click()
    await page.fill("#titleCard", "Olala")
    await page.locator("#timeZoneCard").selectOption("Europe/Paris")
    await (await page.locator("#submitNewCard")).click()

    await expect(await page.locator(".otherTime-card")).toHaveCount(3)

    // Create card no 4
    await page.locator("[role=add-new-card]").click()
    await page.fill("#titleCard", "Mauss")
    await page.locator("#timeZoneCard").selectOption("Europe/Berlin")
    await (await page.locator("#submitNewCard")).click()

    await expect(await page.locator(".otherTime-card")).toHaveCount(4)

    // Create card no 5
    await page.locator("[role=add-new-card]").click()
    await page.fill("#titleCard", "Lost Angel")
    await page.locator("#timeZoneCard").selectOption("America/Los_Angeles")
    await (await page.locator("#submitNewCard")).click()
  })
})
