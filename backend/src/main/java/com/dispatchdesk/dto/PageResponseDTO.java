package com.dispatchdesk.dto;

import java.util.List;

public class PageResponseDTO<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public PageResponseDTO() {}

    public PageResponseDTO(List<T> content, int page, int size, long totalElements, int totalPages) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public static <T> PageResponseDTOBuilder<T> builder() {
        return new PageResponseDTOBuilder<>();
    }

    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public static class PageResponseDTOBuilder<T> {
        private List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;

        public PageResponseDTOBuilder<T> content(List<T> content) { this.content = content; return this; }
        public PageResponseDTOBuilder<T> page(int page) { this.page = page; return this; }
        public PageResponseDTOBuilder<T> size(int size) { this.size = size; return this; }
        public PageResponseDTOBuilder<T> totalElements(long totalElements) { this.totalElements = totalElements; return this; }
        public PageResponseDTOBuilder<T> totalPages(int totalPages) { this.totalPages = totalPages; return this; }

        public PageResponseDTO<T> build() {
            return new PageResponseDTO<>(content, page, size, totalElements, totalPages);
        }
    }
}
