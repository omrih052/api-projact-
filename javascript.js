
var allcoins = [];
var filtercoins = [];
var checkbox = [];

$(document).ready(function () {
    displayHomeScreen();

    $("#chartContainer").hide();
    $("#navHome").on('click', displayHomeScreen);
    $("#searchButton").on('click', searchButton);
    $("#navLiveReport").on('click', displayLiveReport);
    $("#navAbout").on('click', displayabout);
});
// home screen
function displayHomeScreen() {
    checkbox = [];
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins",
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);
        allcoins = d
        createTemplate(d);
        $("#chartContainer").hide();
        $("#aboutContainer").hide();
        $("#container").show();

    });
}

//  create Template eith bootsrap
function createTemplate(d) {
    checkbox = [];
    var coinsTamplate = "";
    for (let i = 0; i < d.length; i++) {
        if (i % 3 == 0) {
            if (i != 0)
                coinsTamplate += `</div>`
            coinsTamplate += `<div class="row" >`
        }
        coinsTamplate += `

    
        <div  class="card col-sm-4" style="width: 18 rem;">
            <div class="card-body">
                <h5 class="card-title">`+ d[i].symbol + `</h5>
                <h5 class="card-title">`+ d[i].name + `</h5>
                <label class="switch">
                <input   name="checkbox" value="value" class="btn" id="${d[i].id}" onclick="makelist(${d[i].id})" type="checkbox">
                        <span class="slider round"></span>
                  </label>
                    <a id="` + d[i].id + `" data-toggle="collapse" href="#a` + i + `" role="button" aria-expanded="false" aria-controls="a` + i + `" class="btn btn-primary" progresfunc()  >More info</a>
            </div>
            <div class="collapse" id="a`+ i + `">
                <div class="card card-body">
    
                </div>
            </div>
        </div>

    `;
    }
    coinsTamplate += `</div>`;
    $("#container").html(coinsTamplate);
    var Alla = $("a[data-toggle='collapse']");
    for (let i = 0; i < Alla.length; i++) {
        Alla[i].onclick = function () {
            informationCoins(this);
        }
    }

}
// search buuton filter by name;
function searchByName() {
    let inputValue = $('form input')[0].value;
    const result = allcoins.filter(coin => coin.name.toUpperCase().includes(inputValue.toUpperCase()));
    createTemplate(result);
    console.log(result)
}
// information coins image and 3 prices in: USD, ILS, EUR; 
function informationCoins(element) {
    var a = element;
    // console.log(element.getAttribute("id"));

    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/" + element.getAttribute("id"),
        method: 'GET',
        success: function (res) {
            if (typeof res === 'string')
                res = JSON.parse(res);
            // console.log($("#" + res.id));
            let innerObject = $($($($("#" + res.id).closest(".card-body")).parent())[0].lastElementChild).children();
            innerObject.html("<img src = '" + res.image.small + "' height='42' width='42'>")
            innerObject.append("<div> USD: " + res.market_data.current_price.usd + "</div>")
            innerObject.append("<div> ILS: " + res.market_data.current_price.ils + "</div>")
            innerObject.append("<div> EUR: " + res.market_data.current_price.eur + "</div>")
        }
    })

}

// make the list and push all coins by id
function makelist(e) {
    if (checkbox.length > 5) {
        alert('sorry no mor then 5 coins')
        return;
    }

    if (!checkbox.find(function (it) { return it.id == e[0].id }))
        checkbox.push(allcoins.find(function (it) { return it.id == e[0].id }))
    else {
        var index = checkbox.indexOf(checkbox.find(function (it) { return it.id == e[0].id }));
        checkbox.splice(index, 1);
    }
    console.log(checkbox);
}
// my progres bar
function move() {
    var elem = document.getElementById("myBar");
    var width = 10;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(id);

        } else {
            width++;
            elem.style.width = width + '%';
            elem.innerHTML = width * 1 + '%';
        }
    }
}


var chart;
function displayLiveReport() {

    if (!chart) {
        chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: ""
            },
            axisY: [],
            axisY2: [],
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: []
        });
        checkbox.forEach((element, i) => {
            let color = selectColor();

            let data = {
                type: "line",
                color: color,
                name: element.name,
                showInLegend: true,
                dataPoints: [{ x: new Date(), y: element.market_data.current_price.usd }]
            }
            let axisYData = {
                title: "" + element.name,
                lineColor: color,
                tickColor: color,
                labelFontColor: "#7F6084",
                titleFontColor: "#7F6084",
                prefix: "$",
                suffix: "k"
            }
            if (i < 2) {
                data.axisYindex = i
                chart.options.axisY.push(axisYData);
            }
            else {
                data.axisYType = "secondary"
                chart.options.axisY2.push(axisYData);
            }
            chart.options.data.push(data);
        });



    }
    addPoint2sec(chart);

    chart.render();

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    $("#chartContainer").show();
    $("#container").hide();


}
function searchButton() {
    move();
    searchByName();

}
function selectColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addPoint2sec(chart, usd) {
    setTimeout(function name() {
        debugger;

        chart.options.data[0].market_data.push({ x: new Date(), y: usd });
        chart.render();

        debugger;
        addPoint2sec()
    }, 2000)
}

function displayabout() {
    $("#chartContainer").hide();
    $("#container").hide();
    $("#aboutContainer").show();
    $("#aboutContainer").empty();
    $("#aboutContainer").append(aboutTamplate);

}
let aboutTamplate = `
    <div class="myInfo"
    <div class="card" style="width: 20rem;">
    <img class="card-img-top" src="7200.jpg" alt="Card image cap">
    <div class="card-body">
        <h5 class="card-title"><strong>omri hudeda</strong></h5>
        <h4 class="card-title"><strong>phon:</strong> 052-7052239</h4>
        <h4 class="card-title"><strong>Email:</strong>omrih052@gmail.com</h4>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
            content.</p>
        </div>
    </div>
</div>
`

function showAboutTamplate() {
    $("#aboutContainer").append(aboutTamplate);
}