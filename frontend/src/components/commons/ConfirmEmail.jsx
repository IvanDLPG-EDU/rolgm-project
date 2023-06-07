import React from "react";

const ConfirmEmail = ({ token }) => {
  return (
    <>
    <br /><br /><br />
        <div>
            Aún No se Ha Verificado Nada.
            <br /><br />
            Debo cambiar en django el absurl para que coincida con esta pagina
            <br /><br />
            Tras eso, debo hacer fetch a django para que verifique el servidor y no el cliente entrando al servidor
        </div>
    </>
  );
};

export default ConfirmEmail;
