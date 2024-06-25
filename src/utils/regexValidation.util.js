import validator from 'validator'



const nameRegex = /^[a-zA-Z]{3,15}( [a-zA-Z]{3,15})?$/
const modelNameRegex = /^(?!.*[.\-_\\s]{2})[A-Za-z0-9]{4,}[a-zA-Z0-9\s\-_]*(?:\s[0-9]+)?$/



export const userValidation = (name, email, password, phone) =>{

    if(name && !nameRegex.test(name)){
        return {message: "name must be a string with at least 3 characters "}
    }

    if(email && !validator.isEmail(email + '')){
        return {message: "email must be a valid email address"}
    }

    if(password && !validator.isStrongPassword( password + '',  {minLength: 4})){
        return {message: "password must contain at least 4 characters, one uppercase letter, one lowercase letter, one number and one special character"}
    }

    if(phone &&!validator.isMobilePhone(phone + '', 'any', {strictMode: true})){
        return {message: "Phone number must start with the country code and meet its country-specific length requirement"}
    }

    return true
}






export const carValidation = (carName, model, rentalStatus)=>{
    
    if(carName && !nameRegex.test(carName)){
        return {message: "name must be a string with at least 3 characters "}
    }

    
    if(model && !modelNameRegex.test(model)){
        return {message: "model must be a string with at least 4 characters"}
    }

    if(rentalStatus && !validator.isIn(rentalStatus, ['available', 'rented'])){
        return {message: `rentalStatus must be either 'available' or 'rented'`}
    }

    return true
}







export const HondaAndToyotaValidation = (name)=>{
    if(!validator.isIn(name, ['honda', 'toyota'])){
        return {message: `name must be either 'honda' or 'toyota'`}
    }

    return true
}