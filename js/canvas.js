const categories = document.querySelectorAll(".categories > a");
const options = document.getElementById("optionsUl");
const dollsUl = document.getElementById("dollsUl");
const canvas = document.getElementById("canvas");
const exportCanvasBtn = document.getElementById("exportCanvasBtn");
const toggleMultiselectBtn = document.getElementById("toggleMultiselectBtn");
const switchDollBtn = document.getElementById("switchDollBtn");
const saveDollsBtn = document.getElementById("saveDollsBtn");
const createNewDollCard = document.getElementById("createNewDollCard");
const deleteAllDollsCard = document.getElementById("deleteAllDollsCard");
var modal = document.getElementById("modal");

var currentCategory;
var toggleMultiselect;
var dolls = [];
var currentDoll;

class Doll {
  constructor() {
    this.options = [];
    var bodyImg = new Image();
    bodyImg.src = "./images/body/0.png";
    this.body = bodyImg;
    this.dataURL = "";
  }

  setFromJsonData(json) {
    Object.assign(this, json);

    //clear and set options
    this.options = [];
    json.options.forEach((opt) => {
      var image = new Image();
      image.src = opt.image;

      var rebuiltOption = new Option(opt.category, image);
      this.options.push(rebuiltOption);
    });

    //set body
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

  setDataURL(url) {
    this.dataURL = url;
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

  setFromJsonData(json) {
    Object.assign(this, json);
  }

  toJSON() {
    return {
      category: this.category,
      image: this.image.src,
    };
  }
}

//Load old data or start fresh
if (localStorage.getItem("dolls")) {
  dollsJson = JSON.parse(localStorage.getItem("dolls"));

  dollsJson.forEach((d) => {
    rebuiltDoll = new Doll();
    rebuiltDoll.setFromJsonData(d);
    dolls.push(rebuiltDoll);
  });
  modal.style.display = "block";

  //implement delete all dolls
  // var dollOption = document.createElement("li");
  // dollOption.classList.add("modalCard");
  // var text = document.createElement("span");
  // text.textContent = "Delete all dolls";
  // dollOption.appendChild(text);

  //on click, localstorage will be cleared
  // dollOption.addEventListener("click", () => {
  //   localStorage.removeItem("dolls");

  //   //clear screen
  //   dolls = [];
  //   currentDoll = null;

  //   //remove all children except first two: 'delete all dolls' and 'create new doll'
  //   removeDollsUlChildren();
  // });
  // dollsUl.appendChild(dollOption);

  //implement create new doll option
  // var dollOption = document.createElement("li");
  // dollOption.classList.add("modalCard");
  // var text = document.createElement("span");
  // text.textContent = "Create A New Doll";

  // dollOption.appendChild(text);
  // dollsUl.appendChild(dollOption);

  loadDolls();

  // dollOption.addEventListener("click", () => {
  //   // Close modal
  //   modal.style.display = "none";

  //   currentDoll = new Doll();
  //   dolls.push(currentDoll);

  //   //re draw the current doll
  //   currentDoll.draw();

  //   //clear the selected options in the ui
  //   optionsArray = [...options.children];
  //   optionsArray.forEach((opt) => {
  //     opt.classList.remove("clickedOption");
  //   });
  // });
} else {
  //No existing dolls => create a new doll
  currentDoll = new Doll();
  dolls.push(currentDoll);
}

window.addEventListener("load", () => {
  // resize the canvas
  canvas.height = window.innerHeight * 0.75;
  canvas.width = "400";

  currentDoll?.draw();
});

// when resizing the browser window, resize the canvas
window.addEventListener("resize", () => {
  // canvas.height = window.innerHeight * 0.75;
  // canvas.width = window.innerWidth * 0.6;
  canvas.height = window.innerHeight * 0.75;
  canvas.width = "400";

  currentDoll?.draw();
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

        if (currentDoll.hasOption(currentCategory, image)) {
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
            currentDoll.removeOption(removeOption);
            currentDoll.draw();
          } else {
            // Select a new option

            //If toggleMultiselect is false we first remove all the other options and then add the new option
            if (toggleMultiselect) {
              clickedOption.target.parentNode.classList.toggle("clickedOption");

              // clickedOption.target should show my image src but is not ideal
              // and should be replaced with something else, when title is clicked
              // => error
              var newOption = new Option(currentCategory, clickedOption.target);
              currentDoll.addOption(newOption);
            } else {
              //remove all the previous options in the ui
              const optionsArray = [...options.children];
              optionsArray.forEach((option) => {
                option.classList.remove("clickedOption");
              });

              //remove all the previous options in the doll object
              currentDoll.removeAllOptionsFromCategory(currentCategory);

              //add the new clicked option in the ui
              clickedOption.target.parentNode.classList.toggle("clickedOption");

              //add the new clicked option in the doll object
              var newOption = new Option(currentCategory, clickedOption.target);
              currentDoll.addOption(newOption);
            }

            currentDoll.draw();
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
    currentDoll.removeAllOptionsFromCategory(currentCategory);

    currentDoll.draw();
  }
});

switchDollBtn.addEventListener("click", () => {
  //export current doll canvas to a dataURL to display
  currentDoll.setDataURL(canvas.toDataURL("png", 1.0));

  // Show modal
  modal.style.display = "block";

  //clear earlier dolls
  removeDollsUlChildren();

  //new doll button
  // var dollOption = document.createElement("li");
  // var text = document.createElement("span");
  // text.textContent = "Create A New Doll";
  // dollOption.style.display = "flex";
  // dollOption.style.flexDirection = "column";
  // dollOption.style.justifyContent = "center";
  // text.style.justifyContent = "center";
  // text.style.textAlign = "center";

  // dollOption.appendChild(text);

  // dollOption.addEventListener("click", () => {
  //   // Close modal
  //   modal.style.display = "none";

  //   currentDoll = new Doll();
  //   dolls.push(currentDoll);

  //   //re draw the current doll
  //   currentDoll.draw();

  //   //clear the selected options in the ui
  //   optionsArray = [...options.children];
  //   optionsArray.forEach((opt) => {
  //     opt.classList.remove("clickedOption");
  //   });
  // });
  // dollsUl.appendChild(dollOption);

  //show existing dolls
  console.log("loading");
  loadDolls();
});

function loadDolls() {
  dolls.forEach((d, index) => {
    var dollOption = document.createElement("li");
    var image = document.createElement("img");
    image.src = d.dataURL;

    dollOption.appendChild(image);

    dollOption.addEventListener("click", (clickedDoll) => {
      //switch doll
      currentDoll = dolls[index];
      // Close modal
      modal.style.display = "none";

      //re draw the current doll
      currentDoll.draw();

      //clear the selected options in the ui and select the options in the currentdoll
      optionsArray = [...options.children];
      optionsArray.forEach((opt) => {
        if (currentDoll.hasOption(currentCategory, opt.firstChild)) {
          opt.classList.add("clickedOption");
        } else {
          opt.classList.remove("clickedOption");
        }
      });
    });

    dollsUl.appendChild(dollOption);
  });
}

saveDollsBtn.addEventListener("click", () => {
  localStorage.setItem("dolls", JSON.stringify(dolls));

  saveDollsBtn.innerText = "Dolls succesfully saved!";

  setTimeout(() => {
    saveDollsBtn.innerText = "Save Dolls";
  }, 3000);
});

function removeDollsUlChildren() {
  while (dollsUl.childElementCount > 2) {
    console.log("removing", dollsUl.lastChild);
    dollsUl.removeChild(dollsUl.lastChild);
  }
}

createNewDollCard.addEventListener("click", () => {
  // Close modal
  modal.style.display = "none";

  currentDoll = new Doll();
  dolls.push(currentDoll);

  //re draw the current doll
  currentDoll.draw();

  //clear the selected options in the ui
  optionsArray = [...options.children];
  optionsArray.forEach((opt) => {
    opt.classList.remove("clickedOption");
  });
});

deleteAllDollsCard.addEventListener("click", () => {
  localStorage.removeItem("dolls");

  //clear screen
  dolls = [];
  currentDoll = null;

  //remove all children except first two: 'delete all dolls' and 'create new doll'
  removeDollsUlChildren();
});
