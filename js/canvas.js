const categories = document.querySelectorAll(".categories > a");
const options = document.getElementById("optionsUl");
var currentCategory;

class Doll {
  constructor() {
    this.options = [];
    var bodyImg = new Image();
    bodyImg.src = "/images/body/0.png";
    this.body = bodyImg;
  }

  addOption(option) {
    this.options.push(option);
  }

  hasOption(category, image) {
    var dollHasOption = false;

    this.options.forEach((opt) => {
      if (opt.category == category && opt.image.src == image.src) {
        dollHasOption = true;
      }
    });

    return dollHasOption;
  }

  removeOption(option) {
    this.options.forEach((opt, index) => {
      if (
        opt.image.src == option.image.src &&
        opt.category == option.category
      ) {
        this.options.splice(index, 1);
      }
    });
  }

  removeAllOptionsFromCategory(category) {
    this.options.forEach((opt, index) => {
      if (index > -1) {
        if (opt.category == category) {
          this.options.splice(index, 1);
          return;
        }
      }
    });
  }

  draw() {
    const ctx = canvas.getContext("2d");
    var x = 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.body, 250, 0, 250, 500);

    this.options.forEach((opt) => {
      ctx.drawImage(opt.image, 250, 0, 250, 500);
      // x = x+10;
    });
  }
}

class Option {
  constructor(category, image) {
    this.category = category;
    this.image = image;
  }
}

const doll = new Doll();

window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");

  // resize the canvas
  canvas.height = window.innerHeight * 0.75;
  canvas.width = window.innerWidth * 0.6;

  doll.draw();
});

// when resizing the browser window, resize the canvas
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight * 0.75;
  canvas.width = window.innerWidth * 0.6;
});

categories.forEach((cat) => {
  cat.addEventListener("click", (cat) => {
    // this will empty my options so previous loaded options will be removed
    options.innerHTML = "";

    // remove clickedCategory on each item, and add on the last clicked item
    categories.forEach((category) => {
      category.classList.remove("clickedCategory");
    });
    cat.target.classList.add("clickedCategory");
    currentCategory = cat.target.innerText;

    for (let index = 0; index < 10; index++) {
      var img = new Image();
      img.src = `./images/${currentCategory}/${index}.png`;

      img.onload = () => {
        var option = document.createElement("li");
        var image = document.createElement("img");
        image.src = `./images/${currentCategory}/${index}.png`;

        if (doll.hasOption(currentCategory, image)) {
          option.classList.add("clickedOption");
        }
        option.appendChild(image);

        option.addEventListener("click", (clickedOption) => {
          if (
            clickedOption.target.parentNode.classList.contains("clickedOption")
          ) {
            clickedOption.target.parentNode.classList.toggle("clickedOption");
            removeOption = new Option(currentCategory, clickedOption.target);
            doll.removeOption(removeOption);
            doll.draw();
          } else {
            // new option
            clickedOption.target.parentNode.classList.toggle("clickedOption");

            // clickedOption.target should show my image src but is not ideal
            // and should be replaced with something else, when title is clicked
            // => error
            newOption = new Option(currentCategory, clickedOption.target);
            doll.addOption(newOption);

            doll.draw();
          }
        });
        options.appendChild(option);
      };
    }
  });
});
// categories.forEach(cat => {
//     cat.addEventListener('click', (cat) => {
//         options.innerHTML = ''
//         var catImageFolder = `./images/${cat.target.innerText}/`;
//         for (let index = 0; index < 10; index++) {
//             var img = new Image()
//             img.src = `./images/${cat.target.innerText}/${index}.jpg`
//             if(img.height != 0){
//                 var option = document.createElement('li')
//                 var image = document.createElement('img')
//                 image.src = `./images/${cat.target.innerText}/${index}.jpg`
//                 option.innerText = `${cat.target.innerText}`
//                 option.appendChild(image)

//                 option.addEventListener('click', (clickedOption) => {
//                     console.log(clickedOption.target)
//                     addToCanvas(clickedOption)
//                 })
//                 options.appendChild(option)
//             }
//         }

//     })
// })

// function addToCanvas(option){

//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(option.target, 100, 100, 200, 200)
// }
