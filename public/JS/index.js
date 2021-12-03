function onlyOne(id){
    // var checkboxes = document.getElementsByClassName('boxes')
    // checkboxes.forEach((item) => {
    //     if (item !== checkbox) item.checked = false
    // })
    for (var i = 1;i <= 2; i++)
    {
        document.getElementById(i).checked = false;
    }
    document.getElementById(id).checked = true;
}