import { Link } from "react-router-dom";
import { useState } from "react";

function Intro() {
    
};

export default function Welcome() {
    const [username, setUsername] = useState("");
    const [weapon, setWeapon] = useState("");
    const [target, setTarget] = useState("");
    const [level, setLevel] = useState("");

    const PlayerData = {
        Username: username,
        Weapon: weapon,
        Target: target,
        Level: level
       
    };



    return (
        <>
            <div className="container">
                <div className="col">
                <img className="logo" src="/asset/logo.png" alt="logo" />
                    <div className="body-game">
                        <input className="input-user" type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                        <div className="select-level">
                            <select className="input-level" name="level" id="" onChange={(e) => setLevel(e.target.value)} >
                                <option >Select Level</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="weapon-body">
                            <label className="weapon1" for="weapon">
                                <img src="/asset/weapon1.png" />
                                <input className="check-weapon1"type="radio" name="weapon" id="weapon" onChange={(e) => setWeapon(e.target.value)} value="weapon1" />
                            </label>
                            <label className="weapon2" for="weapon2">
                                <img src="/asset/weapon2.png" />
                                <input className="check-weapon2"type="radio" name="weapon" id="weapon2" onChange={(e) => setWeapon(e.target.value)} value="weapon2" />
                            </label>
                        </div>
                        <div className="target-body">
                            <label className="target1" for="target1">
                                <img src="/asset/target1.png" />
                                <input className="check-target1" type="radio" name="target" id="target1" onChange={(e) => setTarget(e.target.value)} value="target1" />
                            </label>
                            <label className="target3" for="target3">
                                <img src="/asset/target3.png" />
                                <input className="check-target3" type="radio" name="target" id="target3"  onChange={(e) => setTarget(e.target.value)} value="target3"  />
                            </label>
                            <label className="target2" for="target2">
                                <img src="/asset/target2.png" />
                                <input className="check-target2" type="radio" name="target" id="target2"  onChange={(e) => setTarget(e.target.value)} value="target2"  />
                            </label>
                            
                        </div>
                        <div className="where-popup">
                            <Link className="btn-play" to="/Play" state={PlayerData}>Play Game</Link>
                            <button type="submit" className="btn-intro" onClick={Intro()} >Introduction</button>
                        </div>
                    </div>
                </div><br /><br />
                <div className="col" id="intro">
                    <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi corrupti animi ab similique inventore. Nam consequuntur, repellendus eveniet, quis rerum accusantium, at ratione mollitia velit tempore necessitatibus similique beatae rem!</h1>
                </div>
            </div>  
        </>
    )
}

