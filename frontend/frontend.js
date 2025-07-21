async function signup(){
    const name=document.getElementById("signup-name").value
    const email=document.getElementById("signup-email").value
    const password=document.getElementById("signup-password").value
    await axios.post('/signup',{
        email:email,
        name:name,
        password:password 
    })
    .then((response =>{
            try{
                alert(response.data)
                window.location.href="signin.html"
                
                }
            catch(e){
                alert("Error try again")

            }    
        }
        )
    )

}



async function signin(){
    const email=document.getElementById("signin-email").value
    const password=document.getElementById("signin-password").value
    await axios.post('/signin',{
        email:email,
        password:password
    })
    .then((response => { 
        const token=response.data.token
        if(token){
            localStorage.setItem('token',token)
            window.location.href = "todos.html" 
            
        }
        else{
            localStorage.removeItem('token')
            const msg=response.data.msg
            alert(msg)
        }
    }
        )
    )
}


async function addtodo(){
    const todo=document.getElementById("todo-box").value
    await axios.post('/todo',
        {
            todo:todo,
            done:false,

        },
        {
        headers:{
         token: localStorage.getItem("token"),
 
        }
    }
    )
    .then((response =>{
        const todoID=response.data.todoID
        if(todoID){
            alert("Todo Added Successfully")
            render()
            window.location.href="todos.html"
        }
        else{
            alert("Error")
        }
    }))

}

function updatetodo(){

}


function deletetodo(){

}

function marktodo(){


}

function createcomponent(){

}

async function render(){
    await axios.get('/todo',
        {
            headers:{
            token: localStorage.getItem("token"),
            }
        } 
    )
    .then((response => {
            const todo=response.data.todo
            if(todo){
                const todolist=document.getElementById("todo-list")
                todolist.innerHTML=""
                for(let i=0;i<todo.length;i++){
                    const todoitem=todo[i]
                    const todotitle=document.createElement("h2")
                    todotitle.innerText=todoitem.title
                    const tododone=document.createElement("input")
                    tododone.type="checkbox"
                    tododone.checked=todoitem.done
                    const tododelete=document.createElement("button")
                    tododelete.innerText="Delete"
                    tododelete.onclick=()=>{
                        deletetodo(todoitem)
                    }
                    const todoitemdiv=document.createElement("div")
                    todoitemdiv.append(todotitle,tododone,tododelete)
                    todolist.append(todoitemdiv)
    
                } 
            }
        })       
    )
}




function logout(){
    localStorage.removeItem('token')
    window.location.href="signin.html"
}

