(async () => {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = width = Math.floor(innerWidth);
	canvas.height = height = Math.floor(innerHeight);
	const halfWidth = width >> 1;
	const halfHeight = height >> 1;
	const size = width * (height + 2) * 2;

	const delay = 30;

	let oldIndex = width;
	let newIndex = width * (height + 3);

	let dropletRad = 3;
	let droplet;
	let texture;

	let dropletMap = [];
	let lastMap = [];
	let mapIndex;

	await new Promise(r => {
		var background = new Image();
		background.crossOrigin = "Anonymous";
		background.src = "background.jpg";

		background.onload = function () {
			ctx.drawImage(background, 0, 0, width, height);
			r();
		}
	})

	texture = ctx.getImageData(0, 0, width, height);
	droplet = ctx.getImageData(0, 0, width, height);

	for (let i = 0; i < size; i++) {
		lastMap[i] = 0;
		dropletMap[i] = 0;
	}

	function dropAt(x, y) {
		x <<= 0;
		y <<= 0;

		for (let j = y - dropletRad; j < y + dropletRad; j++) {
			for (let i = x - dropletRad; i < x + dropletRad; i++) {
				dropletMap[oldIndex + (j * width) + i] += 512;
			}
		}
	}

	function newFrame() {
		let i;
		let a, b;
		let data, oldData;
		let currPixel, newPixel;

		i = oldIndex;
		oldIndex = newIndex;
		newIndex = i;

		i = 0;
		mapIndex = oldIndex;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				data = (
					dropletMap[mapIndex - width] +
					dropletMap[mapIndex + width] +
					dropletMap[mapIndex - 1] +
					dropletMap[mapIndex + 1]
				) >> 1;

				data -= dropletMap[newIndex + i];
				data -= data >> 5;
				dropletMap[newIndex + i] = data;
				data = 1024 - data;

				oldData = lastMap[i];
				lastMap[i] = data;

				if (oldData != data) {
					a = (((x - halfWidth) * data / 1024) << 0) + halfWidth;
					b = (((y - halfHeight) * data / 1024) << 0) + halfHeight;

					if (a >= width) a = width - 1;
					if (a < 0) a = 0;
					if (b >= height) b = height - 1;
					if (b < 0) b = 0;

					newPixel = (a + (b * width)) * 4;
					currPixel = i * 4;

					droplet.data[currPixel] = texture.data[newPixel];
					droplet.data[currPixel + 1] = texture.data[newPixel + 1];
					droplet.data[currPixel + 2] = texture.data[newPixel + 2];
				}
				mapIndex++;
				i++;
			}
		}
	}

	function randomDrop() {
		if (Math.random() > 0.3) {
			dropAt(Math.random() * width, Math.random() * height);
		}
	}

	function run() {
		newFrame();
		ctx.putImageData(droplet, 0, 0);
	}

	function getMousePos(canvas, e) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
			y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
		};
	}

	canvas.onmousemove = function (e) {
		let mousePos = getMousePos(canvas, e);
		let mX = mousePos.x;
		let mY = mousePos.y;
		dropAt(mX, mY);
	}

	setInterval(run, delay);
	setInterval(randomDrop, 1250)

	function isMobileTablet() {
		var check = false;
		(function (a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	}

	window.addEventListener("resize", function () {
		if(!isMobileTablet())
			this.location.reload();
		else {
			if($(document.activeElement).prop('type') === 'text') {
				this.document.body.style.height = window.innerHeight;
			} else {
				this.document.body.style.height = '100%';
			}
		}
	})
})()