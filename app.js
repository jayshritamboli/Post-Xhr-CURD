const cl = console.log;

const postContainer =document.getElementById('postContainer')
const postForm =document.getElementById('postForm')
const titleControl =document.getElementById('title')
const contentContol =document.getElementById('Content')
const userIdControl =document.getElementById('UserId')
const addPostBtn =document.getElementById('addPostBtn')
const updatePostBtn =document.getElementById('updatePostBtn')
const loader =document.getElementById('loader')



let BASE_URL = `https://jsonplaceholder.typicode.com/`

let POST_URL = `${BASE_URL}/posts`

function snackBar(title,icon){
    Swal.fire({
        title,
        icon,
        timer:2500
    })
}

const createCards = arr =>{
    let result = arr.map(post=>{
        return `<div class="card mb-3 shadow-lg bg-white rounded" id ="${post.id}">
                <div class="card-header">
                    <h5 class="m-0 text-capitalize">${post.title}</h5>
                </div>
                <div class="card-body">
                    <p class="m-0">${post.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline btn-primary"onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-outline btn-danger"onclick="onRemove(this)">Remove</button>
                 </div>
            </div>`
    }).join('')

cl(result)
postContainer.innerHTML = result

}




function fetchAllPosts(){
    //loader start /show(by removing d-none class)
    loader.classList.remove('d-none')
    // 1st Stap >> create instance/object of XmlHttpRequest

    let xhr = new XMLHttpRequest()
    
    // 2nd configration >> by using open method 

    xhr.open('GET', POST_URL)
    xhr.setRequestHeader('Auth', 'Token from LS')
   
    // 3rd onLoad

    xhr.onload = function (){
        // cl(xhr.status) 200 t0 299  >> API Call success

        if(xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response)
            createCards(data)
        }else{
            snackBar(`somthing went wrong !!!`, 'error')
        }

        // loader stop/hide
        loader.classList.add('d-none')
    }
     
  // send request to BE

    xhr.send(null)

}

fetchAllPosts()


/////Create Card/////>>>>>>>>>>>>>>>>>>>>>

function onPostSubmit(eve){
    eve.preventDefault();

    //get new POST_OBJECT
    let postObj ={
        title : titleControl.value,
        body : contentContol.value,
        UserId: userIdControl.value
    }
    cl(postObj)

    eve.target.reset()
  
    //API call to POST (method send) the obj

    //1 create xhr instance
     loader.classList.remove('d-none')

    xhr = new XMLHttpRequest()

    
    //2 call open method(configration)
    xhr.open("POST", POST_URL)

    // onload

    xhr.onload = function(){
       //API call >> response
        if(xhr.status >= 200 && xhr.status < 300){
            //API call success 
            let res = JSON.parse(xhr.response)
            cl(res)
       

        // create a new card i ui

        let card = document.createElement('div');
        card.className = `card mb-3 shadow rounded`
        card.id = res.id
        card.innerHTML =`<div class="card-header">
                    <h5 class="m-0 text-capitalize">${postObj.title}</h5>
                </div>
                <div class="card-body">
                    <p class="m-0">${postObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline btn-primary"onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-outline btn-danger" onclick="onRemove(this)">Remove</button>
                 </div>
                 </div>`

                 postContainer.append(card)

            snackBar(`New poost is created successfully !!!,`, 'success')
    }else{

        //API call fail
        let err = `somthing went wronge while creating post`

    }
    loader.classList.add('d-none');
}

      
    // send body

    xhr.send(JSON.stringify(postObj))
    
}


function onRemove(ele) {
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then(result => {
  cl (result.isConfirmed) 

    loader.classList.remove('d-none');

    let REMOVE_ID = ele.closest('.card').id;

    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`;

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", REMOVE_URL);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {

            snackBar(`The post with id ${REMOVE_ID} is removed successfully!`, 'success');

            ele.closest('.card').remove();

        } else {
            snackBar(`Something went wrong !!!`, 'error');
        }

        loader.classList.add('d-none');
    }

    xhr.send(null);
  }
)
}




function onEdit(ele) {

    loader.classList.remove('d-none');

    let EDIT_ID = ele.closest('.card').id;
    localStorage.setItem('EDIT_ID', EDIT_ID);

    let EDIT_URL = `${POST_URL}/${EDIT_ID}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {

            let res = JSON.parse(xhr.response);

            titleControl.value = res.title;
            contentContol.value = res.body;
            userIdControl.value = res.userId;

            updatePostBtn.classList.remove("d-none");
            addPostBtn.classList.add("d-none");

        } else {
            snackBar(`Something went wrong`, 'error');
        }

        loader.classList.add('d-none');
    }

    xhr.send(null);
}






function onPostUpdate() {

    loader.classList.remove('d-none');

    let UPDATED_ID = localStorage.getItem('EDIT_ID');
    let UPDATED_URL = `${POST_URL}/${UPDATED_ID}`;

    let UPDATED_OBJ = {
        title: titleControl.value,
        body: contentContol.value,
        userId: userIdControl.value,
        id: UPDATED_ID
    };

    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATED_URL);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {

            let res = JSON.parse(xhr.response);

            // update UI
            let card = document.getElementById(UPDATED_ID);

            card.querySelector(".card-header h5").innerText = UPDATED_OBJ.title;
            card.querySelector(".card-body p").innerText = UPDATED_OBJ.body;


            postForm.reset();
            
            updatePostBtn.classList.add("d-none");
            addPostBtn.classList.remove("d-none");

            snackBar(`Post ID ${UPDATED_ID} updated successfully`, "success");

        } else {
            snackBar(`Something went wrong while updating`, "error");
        }

        loader.classList.add('d-none');
    };

    xhr.send(JSON.stringify(UPDATED_OBJ));
}






updatePostBtn.addEventListener("click", onPostUpdate)
postForm.addEventListener("submit", onPostSubmit)

