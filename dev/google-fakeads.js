(function () {
    let header = document.querySelector('header');

    let topbanner = document.createElement('div');
    topbanner.innerHTML = `
        <div style="margin: 1rem; font-size: 2em; font-weight: bold; background-color: rebeccapurple; color: white; padding: 2rem; display: flex; justify-content: center; align-items: center;">
            <marquee>KLICK MICH! KAUF MICH! KLICK MICH! KAUF MICH! KLICK MICH! KAUF MICH!</marquee>
        </div>
    `;

    header.before(topbanner);

    let box = document.querySelector('.box');

    if (!box) { return; }

    let mediumad = document.createElement('div');
    mediumad.innerHTML = `
        <div style="width: 300px; height: 215px; float: right; margin: 1rem; font-size: 2em; font-weight: bold; background-color: rebeccapurple; color: white; padding: 2rem; display: flex; justify-content: center; align-items: center;">
            KLICK MICH! <br>KAUF MICH!
        </div>
    `;

    box.after(mediumad);
})();
