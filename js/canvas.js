const categories = document.querySelectorAll(".categories > a")
const options = document.getElementById("optionsUl")
var currentCategorie;

class Doll {
    constructor(){
        this.options = [];
    }

    addOption(option){
        this.options.push(option);
    }

    removeOption(option){
        this.options.forEach((opt, index) => {
            if(opt.image == option.image && opt.categorie == option.categorie){
                this.options.splice(index, 1);
            }
        })
    }

    removeAllOptionsFromCategorie(categorie){
        this.options.forEach((opt, index) => {
            if (index > -1){
                if(opt.categorie == categorie){
                    this.options.splice(index, 1);
                    return;
                }
            }

        })
    }

    draw(){
        const ctx = canvas.getContext('2d');
        var x = 100;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.options.forEach(opt => {
            ctx.drawImage(opt.image, x, x, 200, 200)
            x = x+10;
        })
        
    }
}

class Option {
    constructor(categorie, image){
        this.categorie = categorie;
        this.image = image;
    }
}

const doll = new Doll();


window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');

    //resize the canvas
    canvas.height = window.innerHeight * 0.75;
    canvas.width = window.innerWidth * 0.60;

    // doll.draw();
});

//when resizing the browser window, resize the canvas
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight * 0.75;
    canvas.width = window.innerWidth * 0.60;
})

categories.forEach(cat => {
    cat.addEventListener('click', (cat) => {
        //this will empty my options so previous loaded options will be removed
        options.innerHTML = '';

        currentCategorie = cat.target.outerText;
        var catImageFolder = `./images/${cat.target.innerText}/`;
        for (let index = 0; index < 10; index++) {
            var img = new Image()
            img.src = `./images/${cat.target.innerText}/${index}.jpg`
            if(img.height != 0){
                var option = document.createElement('li')
                var image = document.createElement('img')
                image.src = `./images/${cat.target.innerText}/${index}.jpg`
                // option.innerText = `${cat.target.innerText}`
                option.appendChild(image)
        
                option.addEventListener('click', (clickedOption) => {
                    if(clickedOption.target.parentNode.classList.contains('clickedOption')){
                        clickedOption.target.parentNode.classList.toggle('clickedOption');
                        removeOption = new Option(currentCategorie, clickedOption.target)
                        doll.removeOption(removeOption)
                        doll.draw();

                    } else {
                        //new option
                        clickedOption.target.parentNode.classList.toggle('clickedOption');

                        //clickedOption.target should show my image src but is not ideal and should be replaced with something else, when title is clicked => error
                        newOption = new Option(currentCategorie, clickedOption.target)

                        doll.addOption(newOption)
                        doll.draw()
                    }
                    
                })
                options.appendChild(option)
            }
        }      
        
    })
})
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

function addToCanvas(option){

    const ctx = canvas.getContext('2d');
    ctx.drawImage(option.target, 100, 100, 200, 200)
}
