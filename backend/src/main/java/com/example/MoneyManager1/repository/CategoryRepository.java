package com.example.MoneyManager1.repository;

import com.example.MoneyManager1.entity.CategoryEntity;
import com.example.MoneyManager1.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    // select * from tbl_categories where profile_id = ?1
    List<CategoryEntity> findByProfileId(Long profileId);

    // select * from tbl_categories where id = ?1 and profile_id = ?2
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);

    // select * from tbl_categories where type = ?1 and profile_id = ?2
    List<CategoryEntity> findByTypeAndProfileId(String type, Long profileId);

    Boolean existsByNameAndProfileId(String name, Long profileId);

    List<CategoryEntity> findAllByProfile(ProfileEntity profile);

    //boolean existByNameAndProfile_Id(String name, Long id);

    //boolean existByNameAndProfileId(String name, Long id);
}
