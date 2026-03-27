let infoStudents = [
    {
        no: 1,
        id: "",
        studentName: "",
        email: "",
        score: 10,
        result: "Pass"
    },
    {
        no: 2,
        id: "",
        studentName: "",
        email: "",
        score: 10,
        result: "Pass"
    },
];

localStorage.setItem("infoStudents", JSON.stringify(infoStudents));

let infoStudent = localStorage.getItem(JSON.parse(infoStudents)) || [];

function studentsList() {
    let tableList = document.getElementById("listStudent");
    tableList.innerHTML = ``;

    infoStudents.forEach(student => {
        let check;
        if (student.score > 5){
            check = "Pass";
        } else {
            check = "Fail";
        }
        tableList.innerHTML = `<tr>
              <td>${student.no}</td>
              <td>${student.id}</td>
              <td>${student.studentName}</td>
              <td>${student.email}</td>
              <td>${student.score}</td>
              <td>${check}</td>
            </tr>`
    });
    localStorage.setItem("infoStudents", JSON.stringify(infoStudents));
}

function addNewStudent() {
    const studentId = document.getElementById("studentId");
    const nickName = document.getElementById("studentName");
    const studentEmail = document.getElementById("studentEmail");
    const studentScore = document.getElementById("studentScore");

    let id = studentId.value;
    let studentName = nickName.value;
    let email = studentEmail.value;
    let score = studentScore.value;


    const newStudent = {
        no: infoStudents.length - 1,
        id: id,
        studentName: studentName,
        email: email,
        score: score
    }

    infoStudents.push(newStudent);
    localStorage.setItem("infoStudents", JSON.stringify(infoStudents));
    studentsList();
}



















studentsList();

