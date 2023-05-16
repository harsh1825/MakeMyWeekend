export default function Createrole(){
    return(
        <div>
            <h1></h1>
            <form className='adduserform'>
                <div>
                    <div>
                        <input
                            type="text"
                            name="name"
                            className="adduserinput"
                            // value={name}
                            placeholder="Enter New Role"
                            // onChange={(event) => setName(event.target.value)}
                            // onKeyUp={(event) => validation(event, 'name')}
                        />
                    </div>
                
                    <div className='buttons'>
                        <div>
                            <button
                                className="adduserbutton"
                                type="button"
                                // onClick={heading ? update : navigates}
                            >ADD
                            </button>
                        </div>
                        <div>
                            <button
                                className="cancelbutton"
                                type="button"
                                // onClick={cancel}
                            >CANCEL
                            </button>
                        </div>
                    </div>
                </div>
                
            </form>
            
        </div>
    )
}