async function getDollarValue() {
    const url = "https://api.bluelytics.com.ar/v2/latest"
    const response = await fetch(url, {
        method: "GET" // default, so we can ignore
    })
    const data = await response.json()
    return data.blue.value_avg
}

function round(num, decimals) {
    return (Math.round(num * 100) / 100).toFixed(decimals)
}

function main(dollar) {

    let posts = document.querySelectorAll(".postings-container div")
    let isFavorites = false

    if (posts.length == 0) {
        posts = document.querySelectorAll(".sc-bblaLu div")
        isFavorites = true
    }

    posts.forEach(post => {

        let features = post.querySelector("div[data-qa='POSTING_CARD_FEATURES']")
        if (features === null) {
            features = post.querySelector(".sc-jyQkQA")
        }

        let priceDiv = post.querySelector("div[data-qa='POSTING_CARD_PRICE']")
        if (priceDiv === null) {
            priceDiv = post.querySelector(".sc-cwhdKE")
        }

        let price = 0
        let total_meters = 0
        let covered_meters = 0
        let isDollar = true

        try {
            if (priceDiv.innerText.includes("$")) {
                isDollar = false
            }

            const priceStr = priceDiv.innerText.replace("USD", "").replace("$", "").replaceAll(".", "").trim()
            price = parseFloat(priceStr)

            if (!isDollar) {
                price = price / dollar
            }

        } catch (e) {
            return
        }

        if (!!features) {

            const featureList = features.querySelectorAll("span")

            if (featureList[0].innerText.includes("m²")) {

                try {
                    const areaStr = featureList[0].innerText.replace("m²", "").trim()
                    total_meters = parseFloat(areaStr)
                } catch (e) {
                    return
                }

                try {
                    const coveredAreaStr = featureList[2].innerText.replace("m²", "").trim()
                    covered_meters = parseFloat(coveredAreaStr)
                } catch (e) {
                    return
                }

                if (isFavorites) {
                    covered_meters = total_meters
                }

                if (total_meters !== 0 && price !== 0 && total_meters !== NaN && price !== NaN) {

                    const COEFICIENT = 0.40

                    const uncovered_meters = total_meters - covered_meters

                    const price_calculation_unrounded = price / (covered_meters + uncovered_meters * COEFICIENT)

                    const price_calculation = round(price_calculation_unrounded, 2)

                    if (features.parentElement.querySelectorAll(".price-per-meter").length === 0) {

                        let calcStr = price_calculation
                        if (price_calculation < 500) {
                            //alquiler
                            calcStr = "$" + (price_calculation * dollar).toFixed(2) + " (" + price_calculation + " USD)"
                        } else {
                            calcStr = price_calculation + " USD"
                        }

                        let addedHtml = `<div style="color: blue; font-weight: bold;">
                            ${calcStr}
                        </div>`

                        if (price_calculation < 500) {
                            //alquiler
                            const pricePerYear = price * 12

                            const at3Percent = pricePerYear / 0.03
                            const at4Percent = pricePerYear / 0.04

                            const rentIf3Percent = round(at4Percent * 0.03 / 12 * dollar, 2)

                            const calc4percent = round(at4Percent / 1000, 2)
                            const calc3percent = round(at3Percent / 1000, 2)

                            addedHtml += `<div style="margin-top: 5px; color: black; font-weight: bold;">4%: ${calc4percent}K - ($${rentIf3Percent / 1000}K)</div>`
                            addedHtml += `<div style="margin-top: 5px; color: black; font-weight: bold;">3%: ${calc3percent}K </div>`
                        }

                        features.parentElement.innerHTML += "<div style='margin-left: 15px' class='price-per-meter'>" + addedHtml + "</div>"
                    }
                }
            }
        }
    })
}

let dollar = null

async function mainAsync() {

    if (dollar === null) {
        dollar = await getDollarValue()
    }
    main(dollar)
}

setInterval(mainAsync, 1000)