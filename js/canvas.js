const categories = document.querySelectorAll(".categories > a");
const options = document.getElementById("optionsUl");
const canvas = document.getElementById("canvas");
const exportCanvasBtn = document.getElementById("exportCanvasBtn");
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

  // draw() will loop through all the options in this doll object and place them all on the canvas
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
  // resize the canvas
  canvas.height = window.innerHeight * 0.75;
  canvas.width = window.innerWidth * 0.6;

  doll.draw();
});

// when resizing the browser window, resize the canvas
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight * 0.75;
  canvas.width = window.innerWidth * 0.6;

  doll.draw();
});

//Create all the categories, when a category is clicked dynamically create all the corresponding options
//by loading images from the current category folder and checking if the image exists
//if the image exists, create a new option li
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

//Export the canvas to an image
exportCanvasBtn.addEventListener("click", () => exportCanvas());
function exportCanvas() {
  //this will export the canvas to a Data URl that can be downloaded
  canvasDataURL = canvas.toDataURL("png", 1.0);

  //Create a new a tag to download the DataURL just exported
  var link = document.createElement("a");
  link.download = "doll.png";
  link.href = canvasDataURL;

  //By clicking on the new a tag, we automatically download the canvasDataURL as a png without having to click on anything
  link.click();
}
