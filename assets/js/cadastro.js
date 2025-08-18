
  const form = document.getElementById("form");
  const dados = document.getElementById("dados");
  const btnSubmit = document.getElementById("btnSubmit");

  let registrados = JSON.parse(localStorage.getItem("registrados")) || [];
  let editandoIndex = null;

function dadosCadastrados() {
  dados.innerHTML = "";
  registrados.forEach((item, index) => {
    const div = document.createElement("div");

    // Divide a data "aaaa-mm-dd" em [aaaa, mm, dd]
    const [ano, mes, dia] = item.data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`; // Formato pt-BR

    div.innerHTML = `
      <p><strong>Nome:</strong> ${item.nome}</p>
      <p><strong>E-mail:</strong> ${item.email}</p>
      <p><strong>Data de Nascimento:</strong> ${dataFormatada}</p>
      <p><strong>Foto:</strong><br><img src="${item.foto}" alt="${item.nome}" width="100"></p>
      <div class="flex-container">
      <button class = "batata" onclick="editar(${index})">Editar</button>
      <button class = "laranja" onclick="remover(${index})">Remover</button>
      </div>
    `;
    dados.appendChild(div);
  });
}


  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const arquivo = form.foto.files[0];

    if (!arquivo && editandoIndex === null) {
      alert("Selecione uma foto para cadastrar.");
      return;
    }

    const processarCadastro = (fotoBase64) => {
      const cadastro = {
        nome: form.nome.value,
        email: form.email.value,
        data: form.data.value,
        foto: fotoBase64,
      };

      if (editandoIndex !== null) {
        registrados[editandoIndex] = cadastro;
        editandoIndex = null;
        btnSubmit.textContent = "Cadastrar";
      } else {
        registrados.push(cadastro);
      }

      localStorage.setItem("registrados", JSON.stringify(registrados));
      form.reset();
      dadosCadastrados();
    };

    if (arquivo) {
      const reader = new FileReader();
      reader.onload = function () {
        processarCadastro(reader.result);
      };
      reader.readAsDataURL(arquivo);
    } else {
      // Reutiliza a foto anterior se não foi escolhida nova
      processarCadastro(registrados[editandoIndex].foto);
    }
  });

  function remover(index) {
    registrados.splice(index, 1);
    localStorage.setItem("registrados", JSON.stringify(registrados));
    dadosCadastrados();
  }

  function editar(index) {
    const item = registrados[index];
    form.nome.value = item.nome;
    form.email.value = item.email;
    form.data.value = item.data;

    editandoIndex = index;
    btnSubmit.textContent = "Editar";
    alert("Reenvie uma nova foto ou clique em Editar para manter a atual.");
  }

  dadosCadastrados();

