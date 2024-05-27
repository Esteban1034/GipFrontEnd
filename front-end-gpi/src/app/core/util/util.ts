export const Utils = {
    //para que tome un solo '\', se debe incluir dos veces '\\'  
      validaciones:{
          expreClave:{
              "mensaje":"La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número, un caráter especial y mínimo 8 carácteres.",
              "expresion":"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$"
          },
          campoObligatorio:{
              "mensaje":"Este campo es obligatorio"
          },
          maxlength:{
              "valor":50
          },
          camposIguales:{
              "mensaje":"Las contraseñas no coinciden"
          },expreCorreo:{
              "mensaje":"El campo no coincide con un tipo de correo",
              "expresion":"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                          
          },
          maxlengthTxArea:{
              "valor":250                       
          }
  
  
      }
  
  
    }
  