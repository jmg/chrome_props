function main() {

    const posts = document.querySelectorAll(".postings-container div")

    posts.forEach(post => {

        const features = post.querySelector("div[data-qa='POSTING_CARD_FEATURES']")
        const priceDiv = post.querySelector("div[data-qa='POSTING_CARD_PRICE']")
        let price = 0
        let area = 0

        try {
            const priceStr = priceDiv.innerText.replace("USD", "").replace("$", "").replaceAll(".", "").trim()
            price = parseFloat(priceStr)
        } catch (e) {
            return
        }

        if (!!features) {

            const featureList = features.querySelectorAll("span")

            if (featureList[0].innerText.includes("m²")) {

                try {
                    const areaStr = featureList[0].innerText.replace("m²", "").trim()
                    area = parseFloat(areaStr)
                } catch (e) {
                    return
                }

                if (area !== 0 && price !== 0 && area !== NaN && price !== NaN) {
                    const pricePerMeter = price / area
                    const pricePerMeterRounded = (Math.round(pricePerMeter * 100) / 100).toFixed(2);

                    if (features.querySelectorAll(".price-per-meter").length === 0) {
                        features.innerHTML += `<span class='price-per-meter' style="color: blue; font-weight: bold;">$${pricePerMeterRounded}</span>`
                    }
                }
            }
        }
    })
}

setInterval(main, 1000)