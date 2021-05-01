const ok = ()=>{

    try {
        throw new Error("Yash");
    } catch (error) {
        console.log(error);
    }

}

ok();