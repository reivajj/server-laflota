const endingEmail = `<p>&nbsp;</p>
<p><span style="font-family: arial, sans-serif;">¡Te invitamos a dejarnos tus comentarios! → </span><a href="https://www.facebook.com/pg/laflota.distribuciondigital/reviews/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/pg/laflota.distribuciondigital/reviews/&amp;source=gmail&amp;ust=1634757193028000&amp;usg=AFQjCNHTqovcOAZfHoD3jv8FAj2w6tvE_g"><i><b><span style="color: #3d85c6;">Facebook</span></b></i></a> • <b><i><a href="https://g.page/r/CYP5NvamJozCEAg/review" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=https://g.page/r/CYP5NvamJozCEAg/review&amp;source=gmail&amp;ust=1634757193028000&amp;usg=AFQjCNGXshDUsE9sWWqzoxhlNFpVDH_HAQ"><span style="color: #3d85c6;">Google</span></a></i></b></p>
<p>Saludos cordiales,</p>
<p><strong>Equipo de La Flota</strong></p>

<div><a href="https://www.laflota.com.ar/" target="_blank" rel="noopener"><i><b><span style="color: #3d85c6;">La Flota</span></b></i></a></div>
<div>                  <a href="https://www.facebook.com/laflota.distribuciondigital" target="_blank" rel="noopener"><i><b><span style="color: #3d85c6;">Facebook</span></b></i></a> | <a href="https://www.instagram.com/laflota.distribuciondigital/" target="_blank" rel="noopener"><i><b><span style="color: #3d85c6;">Instagram | </span></b></i></a><a href="https://twitter.com/LaflotaD" target="_blank" rel="noopener"><i><b><span style="color: #3d85c6;">Twitter</span></b></i></a></div>`;

//Imagen de la radio
// <img class="an1" src="https://fonts.gstatic.com/s/e/notoemoji/13.1.1/1f4fb/72.png" alt="📻" width="30" height="30" data-emoji="📻" aria-label="📻" />

const timeToDepositText = '<p>La solicitud va a ser procesada dentro de los siguientes 10 días hábiles.</p>';

// Este e-mail es para confirmar que recibimos tu solicitud de retiro de regalías por el monto de u$s 334,81 a través de Paypal. La solicitud va a ser procesada dentro de los siguientes 10 días hábiles. 

// Se depositarán a la siguiente cuenta de Paypal → paypal@laflo.c

const regaliasSolicitadasArsBank = (name, currencyText, accountType, accountValue,
  paymentMethodText, currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp) => {
  const emailHtml =
    `<p>¡Hola <em><strong>${name}</strong></em>! ¿Cómo estás?</p>
    <p>Este email es para confirmar que recibimos tu solicitud de retiro de regalías por el monto de <em>${transferTotalAskedCurrency}</em> <em>${currencyText}</em> a través de <em>${paymentMethodText}</em> el día de hoy. </p>
  <p>Este monto en Pesos Argentinos corresponde a USD <em>${transferTotalUsd}, al tipo de cambio del día solicitado: <em>${currencyRate}</em></p>
  ${timeToDepositText}
  <p>Se depositarán al siguiente <em>${accountType}</em> → <strong>${accountValue}</strong></p>
  
  ${endingEmail}`;

  return emailHtml;
}

const regaliasSolicitadasCupon = (name, transferTotalUsd, currencyRate) => {
  return `
  <p>¡Hola <em><strong>${name}</strong></em>! ¿Cómo estás?</p>
  <p>Este mail es para confirmar que solicitaste regalías en formato Cupón de Crédito el día de hoy.
  ${timeToDepositText}
  <p>El monto en Pesos Argentinos del cupón corresponde a USD <em>${transferTotalUsd}, al tipo de cambio del día solicitado: <em>${currencyRate}</em></p>
 
  ${endingEmail}`
}

const regaliasSolicitadasUsd = (name, currencyText, accountType, accountValue,
  paymentMethodText, currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp) => {
  const emailHtml =
    `<p>¡Hola <em><strong>${name}</strong></em>! ¿Cómo estás?</p>
  <p>Este email es para confirmar que recibimos tu solicitud de retiro de regalías por el monto de <em>${transferTotalUsd}</em> <em>Dolares Estadounidenses (USD)</em> a través de <em>${paymentMethodText}</em> el día de hoy. </p>
  ${timeToDepositText}
  <p>Se depositarán a la siguiente cuenta de<em>${accountType}</em> → <strong>${accountValue}</strong></p>
  
  ${endingEmail}`;

  return emailHtml;
}

const regaliasPagadas = (name, currencyText, accountType, accountValue, paymentMethodText,
  transferTotalUsd, transferTotalAskedCurrency, idPayAccount) => {
  const emailHtml =
    `<p>¡Hola <em><strong>${name}</strong></em>! ¿Cómo estás?</p>
    <p>Este email es para avisarte que ya realizamos el pago de tus regalías por el monto de <strong>${currencyText === "Pesos Argentinos" ? transferTotalAskedCurrency : transferTotalUsd}</strong> <em>${currencyText}</em> a través de <em>${paymentMethodText}</em> el día de hoy. </p>
  ${currencyText === "Pesos Argentinos"
      ? `<p>Se depositaron al siguiente <em>${accountType}</em> → <strong>${accountValue}</strong></p>`
      : `<p> Se depositaron a la siguiente cuenta de <em>${accountType}</em> → <strong>${accountValue}</strong></p>`}
  <p>El código de identificación del pago es el siguiente: <strong><em>${idPayAccount}</em></strong>
  
  ${endingEmail}`;

  return emailHtml;
}

const regaliasPagadasCupon = (name, currencyText, transferTotalAskedCurrency, idPayAccount) => {
  const emailHtml =
    `<p>¡Hola <em><strong>${name}</strong></em>! ¿Cómo estás?</p>
    <p>Este email es para avisarte que ya generamos el cupón de crédito por el monto de <strong>${transferTotalAskedCurrency}</strong> <em>${currencyText}</em> el día de hoy. </p>
  
  <p>El código de identificación del cupón es el siguiente: <strong><em>${idPayAccount}</em></strong>
  
  ${endingEmail}`;

  return emailHtml;
}


const regaliasNotification = (requestedOrPayed, name, currencyText, accountType, accountValue,
  paymentMethodText, currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp, idPayAccount) => {
  if (requestedOrPayed === "requested") {

    if (currencyText === "Pesos Argentinos") {
      if (accountType === "CBU/CVU") return regaliasSolicitadasArsBank(name, currencyText, accountType, accountValue,
        paymentMethodText, currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp);
      if (accountType === "Cupón de Crédito") return regaliasSolicitadasCupon(name, transferTotalUsd, currencyRate)
    }

    if (currencyText === "Dolares Estadounidenses (USD)")
      return regaliasSolicitadasUsd(name, currencyText, accountType, accountValue, paymentMethodText,
        currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp);
  }
  else {
    if (currencyText === "Pesos Argentinos") {
      if (accountType === "CBU/CVU") return regaliasPagadas(name, currencyText, accountType, accountValue, paymentMethodText,
        transferTotalUsd, transferTotalAskedCurrency, idPayAccount);
      if (accountType === "Cupón") return regaliasPagadasCupon(name, currencyText, transferTotalAskedCurrency, idPayAccount);
    }
    if (currencyText === "Dolares Estadounidenses (USD)")
      return regaliasPagadas(name, currencyText, accountType, accountValue, paymentMethodText,
        transferTotalUsd, transferTotalAskedCurrency, idPayAccount);
  }
  return regaliasSolicitadasArsBank(name, currencyText, accountType, accountValue, paymentMethodText,
    currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp, idPayAccount);
}

module.exports = { regaliasNotification }