package service

import (
	"fundz/internal/database"
	"fundz/internal/model/dto"

	"github.com/shopspring/decimal"
)

type CategoryService struct{}

func (c CategoryService) GetCategorySummary(userID string) (dto.CategorySummaryDTO, error) {

	mostUsed, err := GetMostUsedCategory(userID)
	if err != nil {
		return dto.CategorySummaryDTO{}, err
	}

	distribution, err := GetCategoryDistribution(userID)
	if err != nil {
		return dto.CategorySummaryDTO{}, err
	}

	return dto.CategorySummaryDTO{
		MostUsed:     mostUsed,
		Distribution: distribution,
	}, nil
}

func GetMostUsedCategory(userID string) (dto.CategoryMostUsed, error) {

	var result dto.CategoryMostUsed

	err := database.DB.
		Table("transactions").
		Select("categories.name as name, SUM(ABS(transactions.amount)) as amount").
		Joins("JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ?", userID).
		Group("categories.name").
		Order("amount DESC").
		Limit(1).
		Scan(&result).Error

	if err != nil {
		return dto.CategoryMostUsed{}, err
	}

	return result, nil
}

func GetCategoryDistribution(userID string) ([]dto.CategoryDistributionDTO, error) {

	var results []dto.CategoryDistributionDTO

	err := database.DB.
		Table("transactions").
		Select("categories.name as name, SUM(transactions.amount) as amount").
		Joins("JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ?", userID).
		Group("categories.name").
		Order("amount DESC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var total decimal.Decimal

	for _, r := range results {
		total = total.Add(r.Amount)
	}

	if total.IsZero() {
		return []dto.CategoryDistributionDTO{}, nil
	}

	for i := range results {
		results[i].Percentage = results[i].Amount.
			Div(total).
			Mul(decimal.NewFromInt(100)).
			Round(2)
	}

	return results, nil
}
