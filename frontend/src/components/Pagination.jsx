const Pagination = ({ elementsPerPage, totalElements, currentPage, setCurrentPage }) => {
    const pageNumbers = [];
    const limitPages = Math.ceil(totalElements / elementsPerPage)

    for (let i = 1; i <= limitPages; i++) {
        pageNumbers.push(i);
    }

    const paginate = (number) => {
        setCurrentPage(number)
        window.scroll({
            top: 0
        })
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {
                    totalElements > 0 ?
                        <li className="page-item">
                            <button className={`page-link px-2 py-1 ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => paginate(currentPage - 1)}>
                                <i className="bi bi-caret-left-fill"></i>
                            </button>
                        </li>
                        : ''
                }
                {
                    pageNumbers.map(number => (
                        <li key={number} className="page-item">
                            <button className={`page-link py-1 ${number === currentPage ? 'current-page' : ''}`} onClick={() => paginate(number)}>
                                {number}
                            </button>
                        </li>
                    ))
                }
                {
                    totalElements > 0 ?
                        <li className="page-item">
                            <button className={`page-link px-2 py-1 ${currentPage === limitPages ? 'disabled' : ''}`} onClick={() => paginate(currentPage + 1)}>
                                <i className="bi bi-caret-right-fill"></i>
                            </button>
                        </li>
                        : ''
                }
            </ul>
        </nav>
    );
};

export default Pagination;