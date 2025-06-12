import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UserPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}) => {
  return (
    <div className="border w-1/3 flex justify-center mx-auto">
      <Pagination className="border">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${
                currentPage === 1 ? "disabled hidden" : ""
              } select-none`}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem className="flex items-center">
            <p className="text-sm text-gray-500">
              {currentPage} of {totalPages}
            </p>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={`${
                currentPage === totalPages ? "disabled hidden" : ""
              } select-none`}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
export default UserPagination;
