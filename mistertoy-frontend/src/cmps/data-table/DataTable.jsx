import { DataTableRow } from "./DataTableRow.jsx"

export function DataTable({ toys, onRemoveToy }) {
    return <table border="1" className="data-table">
        <thead>
            <tr>
                <th style={{width: '1em'}}>&nbsp;</th>
                <th style={{width: '5em'}}>Id</th>
                <th>Text</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {toys.map(toy =>
                <DataTableRow key={toy._id} toy={toy} onRemoveToy={onRemoveToy} />)}
        </tbody>
    </table>
}
