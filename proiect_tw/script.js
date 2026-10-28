window.onload = function() {
    const mobileNav = document.getElementById("mobile_nav");
    const menuClick = document.getElementsByClassName("menu_click");

    window.addEventListener("resize", () => widthHandler())
    for (const el of menuClick)
        el.addEventListener("click", () => menu());
    getJSON("obiective_turistice.json");

    function widthHandler() {
        if (innerWidth > 1200 && mobileNav.open)
            mobileNav.close();
    }

    function menu() {
        if (mobileNav.open)
            mobileNav.close();
        else
            mobileNav.showModal();
    }

    async function getJSON(file) {
        let myObject = await fetch(file);
        const obJSON = await myObject.json();
        const obiective = document.querySelectorAll("section > article");
        const status = [];

        for (let i = 0; i < obiective.length; i++) {
            const gol = document.createElement("div");
            const subtitlu = document.createElement("button");
            status[i] = document.createElement("span");
            const program = document.createElement("table");
            const rows = [];

            obiective[i].appendChild(gol);
            obiective[i].appendChild(subtitlu);
            obiective[i].appendChild(status[i]);
            obiective[i].appendChild(program);

            subtitlu.classList.add("subtitlu_program");
            subtitlu.innerHTML = "Program";
            subtitlu.addEventListener("click", () => openProgr());
            status[i].classList.add("status_program");

            for (let j = 0; j < 7; j++) {
                rows[j] = document.createElement("tr");
                const header = document.createElement("th");
                const data = document.createElement("td");
                let ore;

                program.appendChild(rows[j]);
                rows[j].appendChild(header);
                rows[j].appendChild(data);
                
                header.innerHTML = obJSON[i].program[j].zi + ":";
                if (obJSON[i].program[j].ore === null)
                    ore = "închis";
                else if (obJSON[i].program[j].ore[1] - obJSON[i].program[j].ore[0] == 24)
                    ore = "nonstop";
                else {
                    if (obJSON[i].program[j].ore[0] < 10)
                        ore = "0" + obJSON[i].program[j].ore[0] + ":00 ";
                    else
                        ore = obJSON[i].program[j].ore[0] + ":00 ";
                    if (obJSON[i].program[j].ore[1] < 10)
                        ore += "- 0" + obJSON[i].program[j].ore[1];
                    else
                        ore += "- " + obJSON[i].program[j].ore[1] + ":00";
                }
                data.innerHTML = ore;
            }

            function openProgr() {
                if (program.style.display === "block")
                    program.style.display = "none";
                else
                    program.style.display = "block";
            }
        }

        const gol2 = document.createElement("div");
        const openFormButton = document.createElement("button");
        const closeFormButton = document.getElementById("closeFormButton");
        const canvas = document.getElementById("close");
        const date = document.getElementById("data");
        const visitors = document.getElementById("nr_vizitatori");
        const list = document.getElementById("lista");
        const form = document.getElementsByTagName("form")[0];
        const vizita = document.createElement("p");
        const name = document.getElementById("nume");
        const timee = document.getElementById("ora");
        const formFields = document.querySelectorAll("label > *");
        const backdrop = document.getElementById("backdrop");
        const formDialog = document.getElementById("formDialog");
        const spinButtons = document.querySelectorAll('[role="spinbutton"]');
        let appointment = localStorage.getItem("progr");

        obiective[1].appendChild(gol2);
        obiective[1].appendChild(openFormButton);
        obiective[1].appendChild(vizita);

        openFormButton.innerHTML = "Programează o vizită";
        openFormButton.id = "openFormButton";
        openFormButton.addEventListener("click", () => openForm());
        openFormButton.addEventListener("mouseover", () => glow());
        openFormButton.addEventListener("mouseleave", () => glowOff());
        closeFormButton.addEventListener("click", () => closeForm());
        formDialog.addEventListener("cancel", escHandler);
        date.addEventListener("change", verif_data);
        visitors.addEventListener("change", verif_lista);
        list.addEventListener("change", verif_lista);
        form.addEventListener("submit", updateVisit);
        if (appointment)
            vizita.innerHTML = localStorage.getItem("progr");
        vizita.id = "vizita"
        window.requestAnimationFrame(time);
        for (const spin of spinButtons)
            spin.setAttribute("aria-label", "ceva");
        drawX();

        function drawX() {
            if (canvas.getContext) {
                const ctx = canvas.getContext("2d");

                ctx.beginPath();
                ctx.moveTo(2, 2);
                ctx.lineTo(4, 2);
                ctx.lineTo(22, 20);
                ctx.lineTo(22, 22);
                ctx.lineTo(20, 22);
                ctx.lineTo(2, 4);
                ctx.lineTo(2, 2);
                ctx.fillStyle = "hsl(43, 63%, 92%)";
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(22, 2);
                ctx.lineTo(22, 4);
                ctx.lineTo(4, 22);
                ctx.lineTo(2, 22);
                ctx.lineTo(2, 20);
                ctx.lineTo(20, 2);
                ctx.lineTo(22, 2);
                ctx.fillStyle = "hsl(43, 63%, 92%)";
                ctx.fill();
            }
        }

        function openForm() {
            backdrop.style.display = "initial";
            formDialog.showModal();
            let p = 0;
            let id = setInterval(openAnim, 0);

            function openAnim() {
                if (p == 26) {
                    closeFormButton.style.display = "flex";
                    clearInterval(id);
                }
                else {
                    backdrop.style.backgroundColor = `hsla(0, 0%, 0%, ${3 * p}%)`;
                    formDialog.style.top = `${100 - 4 * p}%`;
                    formDialog.style.position = "fixed";
                    p++;
                }
            }
        }

        function closeForm() {
            closeFormButton.style.display = "none";
            let p = 25;
            let id = setInterval(closeAnim, 0);

            function closeAnim() {
                if (p == -1) {
                    backdrop.style.display = "none";
                    formDialog.close();
                    document.body.style.overflow = "initial";
                    clearInterval(id);
                }
                else {
                    backdrop.style.backgroundColor = `hsla(0, 0%, 0%, ${3 * p}%)`;
                    formDialog.style.top = `${100 - 4 * p}%`;
                    formDialog.style.position = "fixed";
                    p--;
                }
            }
        }

        function escHandler(event) {
            event.preventDefault();
            closeForm();
        }

        function glow() {
            let color = Math.floor(Math.random() * 256);
            openFormButton.style.boxShadow = `0 0 10px 5px hsl(${color}, 25%, 50%)`;
        }

        function glowOff() {
            openFormButton.style.boxShadow = "none";
        }

        function verif_data() {
            const dateToCheck = new Date(date.value);
            if (dateToCheck.getTime() + dateToCheck.getTimezoneOffset() * 60000 < new Date().getTime())
                date.setCustomValidity("Alegeți o zi din program începând cu ziua de mâine.");
            else if (dateToCheck.getDay() < 1 || dateToCheck.getDay() > 3)
                date.setCustomValidity("Vizitele se pot face de luni până miercuri, conform programului.");
            else
                date.setCustomValidity("");
            date.reportValidity();
        }

        function verif_lista() {
            const count = (list.value.match(/\n/g) || []).length;
            if (count < visitors.value - 1)
                list.setCustomValidity("Scrieți fiecare vizitator pe o linie separată.");
            else if (count > visitors.value - 1)
                list.setCustomValidity("Ați introdus prea mulți vizitatori.")
            else
                list.setCustomValidity("");
        }

        function updateVisit(event) {
            const dataProgr = new Date(date.value);
            event.preventDefault();
            closeForm();
            localStorage.setItem("progr", `Aveți o programare pe numele ${name.value} pe ${dataProgr.toLocaleDateString("ro")} între orele ${timee.value}.`);
            vizita.innerHTML = localStorage.getItem("progr");
            for (const el of formFields)
                el.value = "";
        }

        function time() {
            const now = new Date();
            var day = now.getDay();
            if (day == 0)
                day = 6;
            else
                day--;
            var hour = now.getHours();
            for (let i = 0; i < obiective.length; i++) {
                if (obJSON[i].program[day].ore === null || hour < obJSON[i].program[day].ore[0] || hour >= obJSON[i].program[day].ore[1]) {
                    status[i].innerHTML = "Închis";
                    status[i].style.color = "hsl(0, 60%, 25%)"
                }
                else {
                    status[i].innerHTML = "Deschis";
                    status[i].style.color = "hsl(90, 60%, 25%)"
                }
            }
            window.requestAnimationFrame(time);
        }
    }
}