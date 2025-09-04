package com.example.MoneyManager1.service;


import com.example.MoneyManager1.dto.ExpenseDTO;
import com.example.MoneyManager1.dto.IncomeDTO;
import com.example.MoneyManager1.dto.RecentTransactionDTO;
import com.example.MoneyManager1.entity.ProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    public Map<String, Object> getDashboardData(){
        ProfileEntity profile = profileService.getCurrentProfile();
        Map<String, Object> returnValue = new LinkedHashMap<>();
        List<IncomeDTO> latestIncomes = incomeService.getLatest5IncomesFromCurrentUser();
        List<ExpenseDTO> latestExpenses = expenseService.getLatest5ExpensesFromCurrentUser();

        List<RecentTransactionDTO> recentTransactions = concat(
                latestIncomes.stream().map(income ->
                        RecentTransactionDTO.builder()
                                .id(income.getId())
                                .profileId(profile.getId())
                                .icon(income.getIcon())
                                .name(income.getName())
                                .amount(income.getAmount())
                                .date(income.getDate())
                                .createdAt(income.getCreatedAt())
                                .updatedAt(income.getUpdatedAt())
                                .type("income")
                                .build()),
                latestExpenses.stream().map(expense ->
                        RecentTransactionDTO.builder()
                                .id(expense.getId())
                                .profileId(profile.getId())
                                .icon(expense.getIcon())
                                .name(expense.getName())
                                .amount(expense.getAmount())
                                .date(expense.getDate())
                                .createdAt(expense.getCreatedAt())
                                .updatedAt(expense.getUpdatedAt())
                                .type("expense")
                                .build()))
                // 1. FIX: Use a null-safe comparator for sorting
                .sorted(Comparator.comparing(RecentTransactionDTO::getDate, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(RecentTransactionDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        // 2. IMPROVEMENT: Store totals in variables to avoid redundant calls
        BigDecimal totalIncome = incomeService.getTotalIncomeForCurrentUser();
        BigDecimal totalExpense = expenseService.getTotalExpenseForCurrentUser();

        returnValue.put("totalBalance", totalIncome.subtract(totalExpense));
        returnValue.put("totalIncome", totalIncome);
        returnValue.put("totalExpense", totalExpense);
        returnValue.put("recent5Expenses", latestExpenses);
        returnValue.put("recent5Incomes", latestIncomes);
        returnValue.put("recentTransactions", recentTransactions);

        return returnValue;
    }
}