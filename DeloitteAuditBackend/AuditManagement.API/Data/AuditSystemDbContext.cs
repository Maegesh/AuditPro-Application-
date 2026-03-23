using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using AuditManagement.API.Models;

namespace AuditManagement.API.Data;

public partial class AuditSystemDbContext : DbContext
{
    public AuditSystemDbContext()
    {
    }

    public AuditSystemDbContext(DbContextOptions<AuditSystemDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Audit> Audits { get; set; }

    public virtual DbSet<CorrectiveAction> CorrectiveActions { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Observation> Observations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Audit>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__Audits__A17F23989E4364B0");

            entity.Property(e => e.AuditCode).HasMaxLength(50);
            entity.Property(e => e.AuditName).HasMaxLength(200);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Auditor).WithMany(p => p.AuditAuditors)
                .HasForeignKey(d => d.AuditorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Audits__AuditorI__693CA210");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.AuditCreatedByUsers)
                .HasForeignKey(d => d.CreatedByUserId)
                .HasConstraintName("FK__Audits__CreatedB__6A30C649");

            entity.HasOne(d => d.Department).WithMany(p => p.Audits)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Audits__Departme__68487DD7");
        });

        modelBuilder.Entity<CorrectiveAction>(entity =>
        {
            entity.HasKey(e => e.ActionId).HasName("PK__Correcti__FFE3F4D944E8A319");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.CorrectiveActions)
                .HasForeignKey(d => d.AssignedToUserId)
                .HasConstraintName("FK__Correctiv__Assig__74AE54BC");

            entity.HasOne(d => d.Observation).WithMany(p => p.CorrectiveActions)
                .HasForeignKey(d => d.ObservationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Correctiv__Obser__73BA3083");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DepartmentId).HasName("PK__Departme__B2079BEDF8892A9B");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DepartmentName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Observation>(entity =>
        {
            entity.HasKey(e => e.ObservationId).HasName("PK__Observat__420EA5E75E566500");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Severity).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Audit).WithMany(p => p.Observations)
                .HasForeignKey(d => d.AuditId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Observati__Audit__6EF57B66");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C36F518A3");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534EE561002").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Department).WithMany(p => p.Users)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("FK__Users__Departmen__628FA481");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
