import React, { useState } from "react";
import axios from "axios";
import "./Items.css";
function Item(props) {
  const [comment, setcomment] = useState("");
  const [showData, setShowData] = useState(false);
  const removeActor = () => {
    props.deletActor(props.personInfo.person.id);
    axios.delete(`removeactor/${props.personInfo.person.id}`).then(
      (res) => console.log(res)
      // console.log(`${props.personInfo.person.id} removed from the list`)
    );
  };
  const sendNote = (e) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }
    console.log(e.target);
    axios
      .post(
        `/postcomment/${props.personInfo.person.id}`,
        {
          id: props.personInfo.person.id,
          name: props.personInfo.person.name,
          text: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <tr>
      <td>
        <form onSubmit={sendNote}>
          <input
            type={"text"}
            onChange={(e) => setcomment(e.target.value)}
          ></input>
          <input type={"submit"} />
        </form>
      </td>
      <td>
        <button onClick={removeActor}>remove</button>
      </td>
      <td onClick={() => setShowData((pre) => !pre)} className="idPerson">
        {props.personInfo.person.id}
      </td>
      <td className={showData ? "show" : "hide"}>
        {props.personInfo.person.name}
      </td>
      <td className={showData ? "show" : "hide"}>
        {props.personInfo.person.birthday}
      </td>
      <td className={showData ? "show" : "hide"}>
        {props.personInfo.person.gender}
      </td>
      <td className={showData ? "show" : "hide"}>
        {props.personInfo.person.country.name}
      </td>
    </tr>
  );
}

export default Item;
