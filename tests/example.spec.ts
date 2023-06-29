import { test } from '@playwright/test'

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation']
})

test('Functionality and visual regression tests', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('heading', { name: 'Clouds' }).click()

  await page.getByText('aws-af-south-1').click()

  await page.screenshot({ path: 'Onload.png', fullPage: true })

  await page
    .locator('div')
    .filter({
      hasText:
        /^AllAmazon Web ServicesMicrosoft AzureGoogle Cloud PlatformDigitalOceanUpCloud$/
    })
    .getByRole('combobox')
    .selectOption('Amazon Web Services')
  await page.getByText('aws-af-south-1').click()

  await page.screenshot({ path: 'AmazonOnly.png', fullPage: true })

  await page
    .locator('div')
    .filter({ hasText: /^Order ByDescAsc$/ })
    .getByRole('combobox')
    .selectOption('Asc')

  await page.screenshot({ path: 'AmazonAsc.png', fullPage: true })

  await page
    .locator('div')
    .filter({ hasText: /^DescAsc$/ })
    .getByRole('combobox')
    .selectOption('Desc')

  await page.screenshot({ path: 'AmazonDesc.png', fullPage: true })

  await page
    .locator('div')
    .filter({
      hasText:
        /^AllAmazon Web ServicesMicrosoft AzureGoogle Cloud PlatformDigitalOceanUpCloud$/
    })
    .getByRole('combobox')
    .selectOption('Microsoft Azure')

  await page.screenshot({ path: 'MicrosoftOnly.png', fullPage: true })
})
