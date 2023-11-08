import {TiDelete} from "react-icons/ti";
import React, {useState} from "react";
import {FiMinusSquare, FiPlusSquare} from "react-icons/fi";

export default function List({ label, identifier, selected, elements, onClickCallback, deleteButtonCallback, style }) {

    const [expand, setExpand] = useState(true);

    return (
        <div className="list-container" style={style}>
            {
                label != null &&
                <div className="list-label">
                    <button
                        className="expand-button"
                        onClick={() => { setExpand((prevState) => { return !prevState; }) }}
                    >
                        {
                            expand ?
                                <FiMinusSquare size={20}/>
                                :
                                <FiPlusSquare size={20}/>
                        }
                    </button>
                    <h3 className="title-list">{label}</h3>
                </div>
            }
            {
                expand ?
                    <div className="list-item" style={ elements.length > 15 ? { boxShadow: "inset 0px -5px 10px -10px rgba(0, 0, 0, 0.5)" } : null }>
                        {
                            elements.length > 0 ?
                                elements.map((e) => {
                                    return (
                                        <div key={ e._id } className="list-row">
                                            <span className="list-row-name" style={ selected && selected == e._id ? { color: "rgba(226, 119, 122, 1)" } : null } onClick={() => { onClickCallback(e._id) }}>{e.name}</span>
                                            <button className="delete-button" onClick={() => { deleteButtonCallback(e._id) } }><TiDelete color="#e2777a" size={25} /></button>
                                        </div>
                                    );
                                })
                                :
                                <span>Not found</span>
                        }
                    </div>
                :
                    null
            }

        </div>
    )
}