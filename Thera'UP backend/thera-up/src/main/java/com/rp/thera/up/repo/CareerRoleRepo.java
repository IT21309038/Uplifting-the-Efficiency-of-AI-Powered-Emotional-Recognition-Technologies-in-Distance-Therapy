package com.rp.thera.up.repo;

import com.rp.thera.up.entity.CareerRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CareerRoleRepo extends JpaRepository<CareerRoles, Integer> {

    @Query(value = "SELECT * FROM career_roles WHERE id = ?1", nativeQuery = true)
    CareerRoles findById(int id);
}
