const categories = document.querySelectorAll(".categories > a");
const options = document.getElementById("optionsUl");
const canvas = document.getElementById("canvas");
const exportCanvasBtn = document.getElementById("exportCanvasBtn");
const toggleMultiselectBtn = document.getElementById("toggleMultiselectBtn");
var currentCategory;
var toggleMultiselect;

class Doll {
  constructor() {
    this.options = [];
    var bodyImg = new Image();
    bodyImg.src = "./images/body/0.png";
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
    //we have to loop backwards here and splice when there is a match or else not all options will be reached
    var i;
    i = this.options.length;
    while (i--) {
      if (this.options[i].category == category) {
        this.options.splice(i, 1);
      }
    }
  }

  // draw() will loop through all the options in this doll object and place them all on the canvas
  draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.body, 50, 20, 250, 500);

    this.options.forEach((opt) => {
      ctx.drawImage(opt.image, 50, 20, 250, 500);
    });
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(this.body, 250, 0, 250, 500);

    // this.options.forEach((opt) => {
    //   ctx.drawImage(opt.image, 250, 0, 250, 500);
    // });
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
  // canvas.height = window.innerHeight * 0.75;
  // canvas.width = window.innerWidth * 0.6;

  canvas.height = window.innerHeight * 0.75;
  canvas.width = "400";

  doll.draw();
});

// when resizing the browser window, resize the canvas
window.addEventListener("resize", () => {
  // canvas.height = window.innerHeight * 0.75;
  // canvas.width = window.innerWidth * 0.6;
  canvas.height = window.innerHeight * 0.75;
  canvas.width = "400";

  doll.draw();
});

//Create all the categories, when a category is clicked dynamically create all the corresponding options
//by loading images from the current category folder and checking if the image exists
//if the image exists, create a new option li
categories.forEach((cat) => {
  cat.addEventListener("click", (cat) => {
    // make sure my options element is visisble again
    options.parentElement.style.visibility = "visible";

    // remove clickedCategory on each item, and add on the last clicked item
    categories.forEach((category) => {
      category.classList.remove("clickedCategory");
    });
    cat.target.classList.add("clickedCategory");
    currentCategory = cat.target.innerText;

    // this will empty my options so previous loaded options will be removed
    options.innerHTML = "";

    for (let index = 0; index < 10; index++) {
      var img = new Image();
      img.src = `./images/${currentCategory.toLowerCase()}/${index}.png`;

      img.onload = () => {
        var option = document.createElement("li");
        var image = document.createElement("img");
        image.src = `./images/${currentCategory.toLowerCase()}/${index}.png`;

        if (doll.hasOption(currentCategory, image)) {
          option.classList.add("clickedOption");
        }
        option.appendChild(image);

        //add click listener on option.firstchild so the li isn't accidentally clicked
        option.firstChild.addEventListener("click", (clickedOption) => {
          if (
            clickedOption.target.parentNode.classList.contains("clickedOption")
          ) {
            //Option is already selected, remove it

            clickedOption.target.parentNode.classList.toggle("clickedOption");
            removeOption = new Option(currentCategory, clickedOption.target);
            doll.removeOption(removeOption);
            doll.draw();
          } else {
            // Select a new option

            //If toggleMultiselect is false we first remove all the other options and then add the new option
            if (toggleMultiselect) {
              clickedOption.target.parentNode.classList.toggle("clickedOption");

              // clickedOption.target should show my image src but is not ideal
              // and should be replaced with something else, when title is clicked
              // => error
              var newOption = new Option(currentCategory, clickedOption.target);
              doll.addOption(newOption);
            } else {
              //remove all the previous options in the ui
              const optionsArray = [...options.children];
              optionsArray.forEach((option) => {
                option.classList.remove("clickedOption");
              });

              //remove all the previous options in the doll object
              doll.removeAllOptionsFromCategory(currentCategory);

              //add the new clicked option in the ui
              clickedOption.target.parentNode.classList.toggle("clickedOption");

              //add the new clicked option in the doll object
              var newOption = new Option(currentCategory, clickedOption.target);
              doll.addOption(newOption);
            }

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

toggleMultiselectBtn.addEventListener("click", () => {
  toggleMultiselectBtn.classList.toggle("active");

  if (toggleMultiselectBtn.classList.contains("active")) {
    toggleMultiselect = true;
  } else {
    toggleMultiselect = false;

    //clear all the previous selected elements
    //remove all the previous options in the ui
    const optionsArray = [...options.children];
    optionsArray.forEach((option) => {
      option.classList.remove("clickedOption");
    });

    //remove all the previous options in the doll object
    doll.removeAllOptionsFromCategory(currentCategory);

    doll.draw();
  }
});
