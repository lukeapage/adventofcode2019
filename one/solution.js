let fuel2 = (a) => { let mass = Math.floor(a / 3) - 2; if (mass > 0) {mass += fuel2(mass); } else { return 0 } return mass; }; console.log(fuel2(100756)); document.body.innerText.split('\n').map((a) => a ? fuel2(Number(a)) : 0).reduce((b, total) => total + b)