package com.example.MoneyManager1.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class FilterDTO {

    private String type;
    private LocalDate startDate;
    private LocalDate enddate;
    private String keyword;
    private String sortField; //date, amount, name
    private String sortOrder; //asc, des
}
