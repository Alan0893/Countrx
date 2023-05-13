(async () => {
	const query = (window.location.search).replace('?search=', '');
	const response = await fetchRes(query);

	if(response.status == 404) {
		const header = document.getElementById('header')
		header.style.backgroundColor = 'rgb(209, 105, 105)'

		const body = document.getElementById('info');
		body.innerHTML = ''
		document.body.style.backgroundColor = 'rgb(229, 152, 152)'

		const div = document.createElement('div');
		document.body.appendChild(div);
		const h2 = document.createElement('h2');
		div.appendChild(h2);
		h2.innerText = 'Error 404'
		const h3 = document.createElement('h3');
		div.appendChild(h3);
		h3.innerText = 'Whoops! This country could be found. Please check the spelling of the entered country. ' + 
			'\n\nEntered Country: ' + query;

		const footer = document.getElementById('footer')
		let parentDiv = footer.parentNode;
		parentDiv.insertBefore(div, footer)
		footer.innerHTML = ''
		footer.style.backgroundColor = 'rgb(229, 152, 152)'
		
	} else {	
		const queryF = findQuery(query, response);
		edit(queryF);
	}

	/**
	 * Capitalizes first letter of each word
	 * @param {*} str 
	 * @returns 
	 */
	function toCapitalize(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	/**
	 * Joins str with the separator between the splits
	 * @param {String} str 
	 * @param {String} separator 
	 * @returns a str joined by the separator
	 */
	function toJoin(str, separator, split) {
		let arr = str.trim().split(split);
		let output = "";
		for(let i = 0; i < arr.length-1; i++) {
			output += arr[i] + separator;
		}
		output += arr[arr.length-1];
		return output;
	}

	/**
	 * API Request to REST countries api
	 * @param {String} query the search query 
	 * @returns JSON body of response
	 */
	async function fetchRes(query) {
		query = query.replaceAll('+', '%20')
		const res = await fetch('https://restcountries.com/v3.1/name/' + query)
		const body = await res.json();
		return body;
	}

	/**
	 * Find the query in the response
	 * @param {String} query 
	 * @param {JSON} response 
	 * @returns a country object in json format
	 */
	function findQuery(query, response) {
		let toLowerQ = (query.replaceAll('%20', ' ')).toLowerCase();
		toLowerQ = toLowerQ.replaceAll('+', ' ')

		for(let i = 0; i < response.length; i++) {
			let resName = (response[i].name.common).toLowerCase();
			if(resName.startsWith(toLowerQ)) {
				return response[i];
			}
		}
		return response[0];
	}

	function edit(res) {
		document.title = "Countrx | " + res.name.common

		const country = document.getElementById('country');
		country.innerText = res.name.official + ' (' + res.cca3 + ')'

		const coatOfArms = document.getElementById('coatOfArms');
		if(res.coatOfArms.png != undefined)
			coatOfArms.src = res.coatOfArms.png
		else 
			coatOfArms.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Coat-elements.png/375px-Coat-elements.png";

		const status = document.getElementById('status');
		status.innerText = toCapitalize((res.status).replaceAll('-', ' '))

		const unMember = document.getElementById('unMember');
		unMember.innerText = toCapitalize('' + res.unMember)

		const independent = document.getElementById('independent');
		independent.innerText = toCapitalize('' + res.independent)

		const tld = document.getElementById('tld');
		tld.innerText = (res.tld + '').replaceAll(',', ', ')

		const cca2 = document.getElementById('cca2');
		cca2.innerText = res.cca2;

		const ccn3 = document.getElementById('ccn3');
		ccn3.innerText = res.ccn3

		const maps = document.getElementById('maps');
		maps.src = "https://www.google.com/maps/embed/v1/place?key=" + process.env.API_KEY + "&q=" + (res.name.common)

		const capital = document.getElementById('capital');
		capital.innerText = res.capital

		const capCoordinates = document.getElementById('capCoordinates');
		if(res.capitalInfo.latlng != undefined)
			capCoordinates.innerText = (res.capitalInfo.latlng + '').replace(',', ', ')
		else 
			capCoordinates.innerText = 'N/A'

		const continents = document.getElementById('continents');
		continents.innerText = res.continents

		const region = document.getElementById('region');
		region.innerText = res.region;

		const subregion = document.getElementById('subregion');
		subregion.innerText = res.subregion

		const coordinates = document.getElementById('coordinates');
		coordinates.innerText = (res.latlng + '').replace(',', ', ')

		const borderCountries = document.getElementById('borderCountries');
		if(res.borders != undefined)
			borderCountries.innerText = (res.borders + '').replaceAll(',', ', ')
		else 
			borderCountries.innerText = "None"

		const area = document.getElementById('area');
		area.innerText = (res.area).toLocaleString('en-us') + ' sq km'

		const flag = document.getElementById('flag');
		flag.src = res.flags.png

		const demonyms = document.getElementById('demonyms');
		demonyms.innerText = res.demonyms.eng.m

		const currencies = document.getElementById('currencies');
		var currency = "";
		for(var key in res.currencies) {
			currency += key + ' (' + res.currencies[key].symbol + ') '
		}
		currencies.innerText = toJoin(currency, '), ', ') ')

		const languages = document.getElementById('languages');
		var lang = "";
		for(var key in res.languages) {
			lang += res.languages[key] + ' '
		}
		languages.innerText = toJoin(lang, ', ', ' ')

		const population = document.getElementById('population');
		population.innerText = (res.population).toLocaleString('en-us')

		const gini = document.getElementById('gini');
		var giniCo = "";
		for(var key in res.gini) {
			giniCo += res.gini[key] + ' (' + key + ')'
		}
		if(giniCo != "")
			gini.innerText = giniCo
		else 
			gini.innerText = 'N/A'

		const car = document.getElementById('car');
		car.innerText = toCapitalize(res.car.side)

		const week = document.getElementById('week');
		week.innerText = toCapitalize(res.startOfWeek)

		const postal = document.getElementById('postal');
		if(res.postalCode != undefined)
			postal.innerText = res.postalCode.format
		else 
			postal.innerText = 'N/A'

		const root = document.getElementById('root');
		root.innerText = res.idd.root

		const suffixes = document.getElementById('suffixes');
		suffixes.innerText = ((res.idd.suffixes) + '').replaceAll(',', ', ')

		const timezones = document.getElementById('timezones');
		timezones.innerText = ((res.timezones) + '').replaceAll(',', '\n')
	}
})()