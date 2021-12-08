function onlyOne(id){
    
    for (var i = 1;i <= 2; i++)
    {
        document.getElementById(i).checked = false;
    }
    document.getElementById(id).checked = true;
}

