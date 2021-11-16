const socket = io();    // ESTABLISHING CONNECTION WITH SERVER

const message_input_element = document.getElementsByClassName("message-input")[0];   //  GETTING MESSAGE FROM INPUT FIELD
const message_cointainer = document.querySelector(".messages"); //  SELECTION OF COINTAINER IN WHICH PUBLIC NOTIFICATION AND MESSEGES WILL BE PUSHED
const reciptants = document.querySelector(".reciptants");   //  SELECTING COINTAINER IN WHICH ACTIVE USER WILL BE DISPLAYED
const messages_block = document.querySelector(".messages-block");   //  SELECTION OF COINTAINER IN WHICH PRIVATE MESSEGES BLOCK WILL BE PUSHED

// FUNCTION TO DISPLAY ALL THE MESSAGES AND NOTIFICATIONS
const append = ( data, position) =>{
    
    var messageElement = document.createElement('div');   //  CREATING A DIV
    messageElement.className += "message "; //  ADDING CLASSES IN IT
    messageElement.className += position;   
    
    var spansection = document.createElement('span'); //  CREATING CHILD SECTION OF DIV 
    spansection.innerText = data;
    
    // CREATING NOTIFICATION OF NEW USER
    if ( position == 'joined' ) {   
        spansection.innerText = `${data.joined_user_name} joined the chat.` ;    
    }
    
    // DISPLAYING MESSAGE RECEIVED
    else if ( position == 'received') {
        spansection.innerText = data.message_received ;
        messageElement.setAttribute('id', `${data.sender_id}`);
        messageElement.style.setProperty("--sender_name",`"${data.sender_name}"` );
    } 

    // NOTIFICATION FOR USER LEFT AND DELETING USER FROM ACTIVE LIST
    else if ( position == 'left')   {
        spansection.innerText = `${data.left_user_name} left the chat.`;
        var delete_left_user = "";
        var delete_left_user = document.getElementById(data.left_user_id);
        delete_left_user.remove();
    }
    
    // APPENDING ALL THE EVENTS IN MESSAGE COINTAINER
    messageElement.appendChild(spansection);
    message_cointainer.append(messageElement);
    
    // INSERTING NEW USER IN ACTIVE USER LIST
    if (position == "joined")   {
        const client = document.createElement('div');
        client.className += "client";
        client.setAttribute('id', `${data.joined_user_id}`);
        
        const client_image = document.createElement('div');
        client_image.className += "client-image";
        
        const client_name = document.createElement('div');
        client_name.className += "client-name";
        
        const spanname = document.createElement('span');
        spanname.innerText = data.joined_user_name;
        spanname.setAttribute("onclick",`current_user(this.parentElement.parentElement.id)`)
        
        client_name.appendChild(spanname);
        
        client.appendChild(client_image);
        client.appendChild(client_name);
        
        reciptants.append(client);
    }
}

// FUNCTION TO DISPLAY PERSONAL MESSAGES
function pvt_message( data, position){
    
    var messageElement = document.createElement('div');   //  CREATING A DIV
    messageElement.className += "message "; //  ADDING CLASSES IN IT
    messageElement.className += position;
    
    var spansection = document.createElement('span'); //  CREATING CHILD SECTION OF DIV 
    spansection.innerText = data.message;

    // DISPLAYING PRIVATE MESSAGE RECEIVED
    if ( position == 'received') {
        spansection.innerText = data.message_received ;
        messageElement.appendChild(spansection);    // APPENDING MESSAGE INTO IT'S SECTION
    
        // CONDITION CHECKING FOR AVAILABLE COINTAINER
        if ( document.querySelectorAll(`[id='${data.sender_id}']`).length > 1 ) {
            var message_cointainer = document.querySelectorAll(`[id='${data.sender_id}']`)[1];
            message_cointainer.append(messageElement);
        }

        // INSERTING MESSAGE INTO AVAILABLE COINTAINER
        else {
            const pvt_messages_block = document.createElement('div');
            pvt_messages_block.className += "messages";
            pvt_messages_block.setAttribute('id', data.sender_id );
            messages_block.prepend(pvt_messages_block);

            var message_cointainer = document.querySelectorAll(`[id='${data.sender_id}']`)[1];
            message_cointainer.append(messageElement);
        }
    } else {

    // APPENDING SENDED PRIVATE MESSAGE AT SENDER SIDE COINTAINER
    messageElement.appendChild(spansection);
    var message_cointainer = document.querySelectorAll(`[id='${data.sender_id}']`)[1];
    message_cointainer.append(messageElement);
    } 

}

// SELECT USER/ GROUP TO CHAT
var current_user = ( current_userid ) => {
    
    // CHECKING IF CURRENT ACTIVE USER IS PUBLIC AND SETTING IT'S VISIBILITY MODE 
    if ( current_userid == "public" ) {

        var all_message_cointainers = document.querySelectorAll(".messages");
        all_message_cointainers.forEach(element => {
            element.setAttribute('style', `visibility: collapse`);
        });

        var clicked_user = document.getElementById( "public_messages" );
        clicked_user.style.visibility = "visible";   
        
        var to_send_buttons = document.querySelectorAll(".send_button");
        to_send_buttons.forEach(element => {
            element.setAttribute('style', `visibility: collapse`);
        });

        const to_send = document.getElementById('public_message_send');
        to_send.style.visibility = "visible";

    } 

    // CHECKING IF CURRENT ACTIVE USER HAS IT'S COINTAINER AND SETTING IT'S VISIBILITY MODE 
    else if ( document.querySelectorAll(`[id='${current_userid}']`).length > 1 ) {
        
        var all_message_cointainers = document.querySelectorAll(".messages");
        all_message_cointainers.forEach(element => {
            element.setAttribute('style', `visibility: collapse`);
        });

        var clicked_user = document.querySelectorAll(`[id='${current_userid}']`)[1];
        clicked_user.style.visibility = "visible";

        var send_button = document.querySelectorAll(".send_button");
        send_button.forEach(element =>{
            element.setAttribute('style', `visibility: collapse`);
        });

        var active_button = document.querySelectorAll(`[id='${current_userid}']`)[2];
        active_button.style.visibility = "visible";
    }

    // CREATING A COINTAINER FOR ACTIVE USER AND SETTING IT'S VISIBILITY MODE 
    else  {
        const pvt_messages_block = document.createElement('div');
        pvt_messages_block.className += "messages";
        pvt_messages_block.setAttribute('id', current_userid );
        messages_block.prepend(pvt_messages_block);

        var all_message_cointainers = document.querySelectorAll(".messages");
        all_message_cointainers.forEach(element => {
            element.setAttribute('style', `visibility: collapse`);
        });
        
        var clicked_user = document.querySelectorAll(`[id='${current_userid}']`)[1];
        clicked_user.style.visibility = "visible";

        var create_button = document.createElement('button');
        create_button.className += "send_button";
        create_button.setAttribute('id', current_userid );
        create_button.setAttribute("onclick",`send_message(this.id)`)

        const send_logo = document.createElement('img');
        send_logo.setAttribute('src', 'css/icon.png');
        
        create_button.appendChild(send_logo);
        message_input_element.append(create_button);

        var send_button = document.querySelectorAll(".send_button");
        send_button.forEach(element =>{
            element.setAttribute('style', `visibility: collapse`);
        });

        var active_button = document.querySelectorAll(`[id='${current_userid}']`)[2];
        active_button.style.visibility = "visible";

    }

    var non_seleceted = document.querySelectorAll(".client-name");
    non_seleceted.forEach(element => {
        element.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";
    });

    if( current_userid != "public"){
        var current_user_element = document.getElementById( current_userid ).childNodes[1];
        current_user_element.style.boxShadow = "rgba(43, 0, 255, 0.22) 0px 0px 16px";
    }



}

// FUNCTION TO DISPLAY PREVIOUSLY ACTIVE USERS IN NEW USER'S ACTIVE LIST 
const active_users_display = ( users, my_id ) =>{

    for (const [key, value] of Object.entries(users)) {
        
        const client = document.createElement('div');
        client.className += "client";
        client.setAttribute('id', key);
        
        const client_image = document.createElement('div');
        client_image.className += "client-image";
        
        const client_name = document.createElement('div');
        client_name.className += "client-name";
        
        const spanname = document.createElement('span');
        spanname.innerText = value;
        spanname.setAttribute("onclick",`current_user(this.parentElement.parentElement.id)`);
        
        client_name.appendChild(spanname);
        
        client.appendChild(client_image);
        client.appendChild(client_name);
        
        reciptants.append(client);
    }

    const my_div = document.getElementById(my_id);
    my_div.remove();
}

// GLOW ON PUBLIC CHAT
function public_chat(){
    const public_chat_button = document.getElementById("public");
    public_chat_button.parentElement.style.boxShadow = "rgba(43, 0, 255, 0.22) 0px 0px 16px";
}

// ACCEPTING NEW USERS NAME AND CHECKING VALIDATIONS
const user_name = prompt("Enter Your Name..! ( Max. 20 character. )"); // SIGN UP FOR NEW USER
if ( user_name )    {
    if ( user_name.length > 20 ){
        user_name = prompt("Name must contain less than 20 characters..!")
        socket.emit('new-user-joined', user_name);
        const my_name = document.getElementById("my-name"); // DISPLAYING CURRENT USER NAME
        my_name.innerText = user_name.toUpperCase();  
    } else {
        socket.emit('new-user-joined', user_name);
        const my_name = document.getElementById("my-name"); // DISPLAYING CURRENT USER NAME
        my_name.innerText = user_name.toUpperCase();  
    }
}   

// HANDLING NEW USER'S ACTIVE LIST
socket.on('current_active_users_list', data =>{
    active_users_display( data.active_user, data.my_id );
});


// FUNCTION TO SEND MESSAGE DATA TO OTHER USER 
function send_message( to_user )   {

    // CHECKING IF CURRENT MESSAGE SENDED IS TO PUBLIC CHAT OR PRIVATE
    if ( to_user == 'public' ) {
        if ( user_name )    {
            const message_sended = document.getElementById('message_input').value;
            if (message_sended) {
                socket.emit('message-sended', message_sended )
                append( message_sended, 'sended');
            }
            else    {
                alert("Please enter a message.");
            }
            document.getElementById('message_input').value = "";
        } else {
            location.reload();
        }
    } else {
        if ( user_name )    {
            const message_sended = document.getElementById('message_input').value;
            if (message_sended) {
                socket.emit('pvt-message-sended', {to: to_user, message: message_sended, my_id: socket.id});
                pvt_message( {message: message_sended, sender_id: to_user} ,'sended');  
            }
            else    {
                alert("Please enter a message.");
            }
            document.getElementById('message_input').value = "";
        } else {
            location.reload();
        }
    }
}

// FUNCTION TO INFORM NEW USER AND ADDING IT IN ACTIVE USERS LIST
socket.on('user-joined', data =>{  
    append( {joined_user_name: data.new_user_name, joined_user_id: data.new_user_id},'joined');  
});

// FUNCTION TO RECEIVE NEW MESSAGE
socket.on('message-received', data =>{  
    if ( user_name )    {
    append( {message_received: data.message, sender_name: data.sender_name, sender_id: data.sender_id} ,'received');  
    var message_cointainer = document.getElementsByClassName("messages");
    } else {
        alert("Please Enter your Name to read the chat..!");
        location.reload();
    }
});


// FUNCTION TO RECEIVE NEW PRIVATE MESSAGE
socket.on('pvt_message_received', data =>{  
    // console.log(data.message_received, data.received_from);
    if ( user_name )    {
    pvt_message( {message_received: data.message_received, sender_id: data.received_from} ,'received'); 
    } else {
        alert("Please Enter your Name to read the chat..!");
        location.reload();
    }
});

// FUNCTION TO INFORM LEFT USER
socket.on('user-left', left_user =>{  
    append({left_user_id: left_user.left_user_id ,left_user_name: left_user.left_user_name },'left');  
});