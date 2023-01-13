(async () => {
	window.addEventListener("load", async () => {
		const btn1 = document.getElementById('s1');
		const btn2 = document.getElementById('s2');
		const btn3 = document.getElementById('s3');

		const res = await fetchAll();
		const rand = randArr(3, res.length);

		btn1.innerText = res[rand[0]].name.common
		btn2.innerText = res[rand[1]].name.common
		btn3.innerText = res[rand[2]].name.common
	})
	const btn = document.querySelectorAll('[button]')
	btn.forEach(button => {
		button.addEventListener("click", () => {
			location.href = '../country/country.html?search=' + button.innerText
		})
	})

	const form = document.getElementById('form');
	const search = document.getElementById('search');

	const label = document.getElementById('label')

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const query = (search.value).replaceAll(' ', '%20')
		const response = await fetchRes(query);
 
		if(response.status !== 404 && query != '') {
			location.href = '../country/country.html?search=' + search.value
		} else {
			search.value = ''

			label.innerText = 'ENTER A VALID COUNTRY'
			label.style.color = '#FF0000'
			label.style.fontSize = '12px'
			label.style.fontWeight = 'bold'
		}
	})


	/**
	 * API Request to REST countries api
	 * @param {String} query the search query 
	 * @returns JSON body of response
	 */
	async function fetchRes(query) {
		const res = await fetch('https://restcountries.com/v3.1/name/' + query)
		const body = await res.json();
		return body;
	}
	/**
	 * API Request to REST countries api
	 * @returns JSON body of response
	 */
	async function fetchAll() {
		const res = await fetch('https://restcountries.com/v3.1/all');
		const body = await res.json();
		return body;
	}

	function randArr(arrLength, range) {
		let arr = [];
		
		for(let i = 0; i < arrLength; i++) {
			let rand = Math.trunc(Math.random() * range);

			if(arr.includes(rand)) {
				i--;
			} else {
				arr.push(rand);
			}
		}
		return arr;
	}
})()