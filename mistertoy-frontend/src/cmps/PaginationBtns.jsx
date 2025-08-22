export function PaginationBtns({ onChangePageIdx, filterBy }) {
    return (
        <div className="pagination-btns flex align-center">
            <button className="btn" onClick={() => onChangePageIdx(-1)}>
                Previous
            </button>
            <span>{+filterBy.pageIdx + 1}</span>
            <button className="btn" onClick={() => onChangePageIdx(1)}>
                Next
            </button>
        </div>
    )
}