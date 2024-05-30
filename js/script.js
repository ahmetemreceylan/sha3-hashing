(function(){
    const textarea = document.getElementById("text-left");
    const hashdiv = document.getElementById("text-right");
    const bit = document.querySelector("#middle #bit");
    const switcher = document.getElementById("switch");
    const file = document.getElementById("drag-file");
    const file_input = document.getElementById("file-input");
    let isText = true;
    let fileinfo;

    if(!localStorage.getItem("file-bit")){
        localStorage.setItem("file-bit","BIT");
    }

    if(!localStorage.getItem("text-bit")){
        localStorage.setItem("text-bit","BIT");
    }

    if(localStorage.getItem("lor")=="r"){
        switcher.lastElementChild.style.backgroundColor="#FF9F66";
        switcher.firstElementChild.style.backgroundColor="#FF5F00";
        hashdiv.value="";
        textarea.style.display="none";
        file.style.display="inline-block";
        isText = false;
        if(localStorage.getItem("file-bit")){
            bit.value=localStorage.getItem("file-bit");
        }
    }
    else{
        textarea.focus();
        if(localStorage.getItem("text-bit")){
            bit.value=localStorage.getItem("text-bit");
        }
    }
    textarea.addEventListener("input",()=>{
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + 4 + "px" ;
        sendServer(textarea.value,bit.value,true);
    });

    bit.addEventListener("input",()=>{
        if(isText){
            sendServer(textarea.value,bit.value,true);
            localStorage.setItem("text-bit",bit.value);
        }

        else{
            sendServer(fileinfo,bit.value,false);
            localStorage.setItem("file-bit",bit.value);
        }
    });

    switcher.addEventListener("click",(e)=>{
        if(e.target.id=="switch-right"){
            switcher.lastElementChild.style.backgroundColor="#FF9F66";
            switcher.firstElementChild.style.backgroundColor="#FF5F00";
            hashdiv.value="";
            textarea.style.display="none";
            file.style.display="inline-block";
            isText = false;
            localStorage.setItem("lor","r");
            bit.value=localStorage.getItem("file-bit");
            if(fileinfo){
                sendServer(fileinfo,bit.value,false);
            }
        }
        else{
            switcher.lastElementChild.style.backgroundColor="#FF5F00";
            switcher.firstElementChild.style.backgroundColor="#FF9F66";
            textarea.style.display="inline-block";
            hashdiv.value="";
            file.style.display="none";
            isText = true;
            localStorage.setItem("lor","l");
            textarea.focus();
            bit.value=localStorage.getItem("text-bit");
            if(textarea.value!=""){
                sendServer(textarea.value,bit.value,true);
            }
        }
    });

    file.firstElementChild.addEventListener("dragenter",()=>{
        file.style.height = "11em";
        file.style.transform = "scaleX(2.0);";
    });

    file.firstElementChild.addEventListener("dragleave",()=>{
        file.style.height = "10em";
        file.style.transform = "scaleX(1.0);";
    });

    file.firstElementChild.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });

    file.addEventListener("drop",(e)=>{
        e.preventDefault();
        file.firstElementChild.textContent=e.dataTransfer.files[0].name;
        fileinfo = e.dataTransfer.files[0];
        sendServer(e.dataTransfer.files[0],bit.value,false);
    });

    file_input.addEventListener("change",(e)=>{
        file.firstElementChild.textContent=e.target.files[0].name;
        fileinfo = e.target.files[0];
        sendServer(e.target.files[0],bit.value,false);
    });

    function sendServer(content,bit,isTextt){
        if(isTextt){
            fetch("/send-text",{
                method:"POST",
                body:JSON.stringify({
                    "content": content,
                    "bit": bit
                })
            }).then(response=>response.text())
            .then(data=>{
                hashdiv.value=data;
            });
        }
        else{
            fetch("/send-file",{
                method:"POST",
                body:content,
                headers:{
                    "bit":bit
                }
            }).then(response=>response.text())
            .then(data=>{
                hashdiv.value=data;
            });
        }
    }
})();