import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { modifyFilter } from '../../features/dishesListSlice/dishesListSlice';


const Filter = ({display_name, filter_key, options, color='black'}) => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState('none');
    const handleSelect = (eventKey) => {
        setSelected(eventKey);
        dispatch(modifyFilter({filter_key, filter_value: eventKey}));
    }

return (
    <>
    <Dropdown onSelect={(eventKey) => handleSelect(eventKey)}>
        <Dropdown.Toggle style={{backgroundColor: color}}  id="dropdown-basic">
            {display_name}: {selected}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item eventKey="none">-</Dropdown.Item>
            {options.map((option, index) => {
                return <Dropdown.Item key={index} eventKey={option}>{option}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>
    </>
)
}

export default Filter