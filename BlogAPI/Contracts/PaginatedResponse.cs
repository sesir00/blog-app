namespace BlogAPI.Contracts
{
    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();  // The actual items for the current page
        public int PageNumber { get; set; } //Which page you're currently viewing
        public int PageSize { get; set; }   // How many items per page
        public int TotalCount { get; set; } //Total number of items in the entire dataset
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);  //How many pages exist total (calculated automatically)
    }
}
