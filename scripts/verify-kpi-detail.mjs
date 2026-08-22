import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:3000/en/dashboard', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))

// Periksa 4 KPI card
const cards = await page.evaluate(() => {
  const strip = document.querySelector('.bg-border')
  const children = strip ? Array.from(strip.children) : []
  return children.map((c, i) => {
    const value = c.querySelector('.font-mono.text-2xl')
    const label = c.querySelector('.mono-label')
    const icon = c.querySelector('svg')
    return {
      index: i,
      label: label?.textContent?.trim(),
      value: value?.textContent?.trim(),
      valueColor: value?.className,
      iconColor: icon?.className,
    }
  })
})

console.log('KPI Cards:')
cards.forEach(c => console.log(`  ${c.index}: ${c.label} = ${c.value} | valueColor=${c.valueColor} | iconColor=${c.iconColor}`))

// Cek pemisah
const borderCheck = await page.evaluate(() => {
  const strip = document.querySelector('.bg-border')
  if (!strip) return null
  const children = strip.children
  const first = children[0]
  // Cek border kiri pertama
  const firstBorder = first?.className
  // Cek border-top
  return {
    firstCardHasLeftBorder: firstBorder?.includes('border-l'),
    firstCardHasTopBorder: firstBorder?.includes('border-t'),
    firstCardHasRounded: firstBorder?.includes('rounded-tl'),
  }
})
console.log('Border/Pemisah:', JSON.stringify(borderCheck))

await browser.close()